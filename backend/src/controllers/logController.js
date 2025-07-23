import Log from '../models/Log.js';

export const getLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, AppName, UserId, Level, from, to, LogId } = req.query;
    const filter = {};
    if (AppName) filter.AppName = { $regex: AppName, $options: 'i' };
    if (UserId) filter.UserId = Number(UserId);
    if (Level) filter['Log.Level'] = Level;
    if (LogId) filter.LogId = Number(LogId);
    if (from || to) {
      filter['Log.TimeStamp'] = {};
      
      const parseDate = (dateStr) => {
        // First check if it's a simple date (without time)
        const simpleDateMatch = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})$/);
        if (simpleDateMatch) {
          const [fullDate, day, month, year] = simpleDateMatch;
          return new Date(`${year}-${month}-${day}`);
        }

        // Handle the format with time: DD-MM-YYYYTDay MMM DD YYYY HH:MM:SS GMT+HHMM
        const dateTimeMatch = dateStr.match(/(\d{2})-(\d{2})-(\d{4})T\w{3} (\w{3}) (\d{2}) (\d{4}) (\d{2}):(\d{2}):(\d{2}) GMT\+\d{4}/);
        if (dateTimeMatch) {
          const [
            fullMatch, 
            day, 
            month, 
            shortYear, 
            monthName, 
            dayOfMonth, 
            fullYear, 
            hours, 
            minutes, 
            seconds
          ] = dateTimeMatch;
          
          // Create date with time in local timezone
          return new Date(
            parseInt(fullYear, 10),
            new Date(parseInt(fullYear, 10), parseInt(month, 10) - 1, 1).getMonth(),
            parseInt(dayOfMonth, 10),
            parseInt(hours, 10),
            parseInt(minutes, 10),
            parseInt(seconds, 10)
          );
        }

        // Try to parse as ISO string (fallback)
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          console.error('Failed to parse date:', dateStr);
          throw new Error(`Invalid date format. Please use DD-MM-YYYY or the full date-time format.`);
        }
        return date;
      };

      if (from) {
        const fromDate = parseDate(from);
        if (isNaN(fromDate.getTime())) {
          return res.status(400).json({ 
            error: 'Invalid from date format. Please use DD-MM-YYYY or YYYY-MM-DD format',
            received: from
          });
        }
        filter['Log.TimeStamp'].$gte = fromDate;
      }

      if (to) {
        const toDate = parseDate(to);
        if (isNaN(toDate.getTime())) {
          return res.status(400).json({ 
            error: 'Invalid to date format. Please use DD-MM-YYYY or YYYY-MM-DD format',
            received: to
          });
        }
        // Set to end of day for 'to' date
        toDate.setHours(23, 59, 59, 999);
        filter['Log.TimeStamp'].$lte = toDate;
      }
    }

    const logs = await Log.find(filter)
      .sort({ 'Log.TimeStamp': -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Log.countDocuments(filter);

    res.json({
      data: logs,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    next(err);
  }
};

export const getLogById = async (req, res, next) => {
  try {
    const log = await Log.findById(req.params.id);
    if (!log) return res.status(404).json({ error: 'Log not found' });
    res.json(log);
  } catch (err) {
    next(err);
  }
};

export const getLogStats = async (req, res, next) => {
  try {
    // Get basic stats
    const totalLogs = await Log.countDocuments();
    const errorsToday = await Log.countDocuments({
      'Log.Level': 'error',
      'Log.TimeStamp': { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    });
    
    // Get logs by level
    const logsByLevel = await Log.aggregate([
      { $group: { _id: '$Log.Level', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Get logs by application, respecting filters
    const appFilter = {};
    if (req.query.AppName) appFilter.AppName = { $regex: req.query.AppName, $options: 'i' };
    if (req.query.Level) appFilter['Log.Level'] = req.query.Level;
    const logsByApp = await Log.aggregate([
      { $match: appFilter },
      { $group: { _id: '$AppName', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);


    // --- Week selection logic ---
    let weekOffset = parseInt(req.query.week) || 0; // 0 = current week, -1 = last week, etc.
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    // Find most recent Sunday
    const currentDay = now.getDay(); // 0=Sunday
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - currentDay + (weekOffset * 7));
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Get error trends by day of week for selected week
    const errorTrends = await Log.aggregate([
      {
        $match: {
          'Log.Level': 'error',
          'Log.TimeStamp': {
            $gte: startOfWeek,
            $lte: endOfWeek
          }
        }
      },
      {
        $group: {
          _id: {
            $dayOfWeek: '$Log.TimeStamp'
          },
          count: { $sum: 1 },
          lastDate: { $max: '$Log.TimeStamp' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Map day numbers to day names and ensure all days are present
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const formattedTrends = Array(7).fill().map((_, index) => {
      const dayNumber = index + 1; // $dayOfWeek returns 1 (Sunday) to 7 (Saturday)
      const dayData = errorTrends.find(d => d._id === dayNumber) || { count: 0 };
      
      // Get the most recent date for this day of the week
      const today = new Date();
      const targetDay = new Date(today);
      const currentDay = today.getDay() + 1; // Convert to 1-7 format
      const diff = (7 + dayNumber - currentDay) % 7;
      targetDay.setDate(today.getDate() - (7 - diff));
      targetDay.setHours(0, 0, 0, 0);
      
      return {
        dayOfWeek: dayNumber,
        dayName: dayNames[index],
        count: dayData.count,
        // Use the most recent date for this day of the week
        date: targetDay.toISOString().split('T')[0]
      };
    });

    // Get recent logs for the dashboard
    const recentLogs = await Log.find()
      .sort({ 'Log.TimeStamp': -1 })
      .limit(100);

    // Dummy data for avg response time and users online
    const avgResponseTime = Math.floor(Math.random() * 50) + 100; // 100-150ms
    const usersOnline = Math.floor(Math.random() * 50) + 50; // 50-100

    res.json({
      totalLogs,
      errorsToday,
      logsByLevel,
      logsByApp,
      dailyTrends: formattedTrends,
      logs: recentLogs, // Add the logs to the response
      avgResponseTime,
      usersOnline,
    });
  } catch (err) {
    next(err);
  }
};