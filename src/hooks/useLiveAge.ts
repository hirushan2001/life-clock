import { useState, useEffect, useMemo, useCallback } from 'react';

export interface AgeBreakdown {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  totalDays: number;
  totalWeeks: number;
  totalMilliseconds: number;
}

export interface LifeInsights {
  percentComplete: number;
  weeksLived: number;
  currentWeek: number;
  weeksRemaining: number;
  yearsRemaining: number;
  weekendsRemaining: number;
}

export function useLiveAge(dateOfBirth: string | null, targetAge: number = 80, updateInterval: number = 50) {
  const [now, setNow] = useState(Date.now());

  // Timer for live updates
  useEffect(() => {
    if (!dateOfBirth) return;

    let animationFrameId: number;
    let timeoutId: NodeJS.Timeout;
    let lastUpdate = Date.now();

    const updateTime = () => {
      const currentTime = Date.now();
      if (currentTime - lastUpdate >= updateInterval) {
        setNow(currentTime);
        lastUpdate = currentTime;
      }

      if (updateInterval < 1000) {
        // For high frequency, use rAF
        animationFrameId = requestAnimationFrame(updateTime);
      } else {
        // For low frequency, use timeout
        timeoutId = setTimeout(updateTime, updateInterval);
      }
    };

    updateTime();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [dateOfBirth, updateInterval]);

  // Calculate age breakdown
  const age = useMemo((): AgeBreakdown | null => {
    if (!dateOfBirth) return null;

    const birth = new Date(dateOfBirth).getTime();
    const diff = now - birth;

    if (diff < 0) {
      return {
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        totalDays: 0,
        totalWeeks: 0,
        totalMilliseconds: 0,
      };
    }

    const totalMilliseconds = diff;
    const totalSeconds = Math.floor(diff / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalWeeks = Math.floor(totalDays / 7);

    // Calculate precise age components
    const birthDate = new Date(dateOfBirth);
    const nowDate = new Date(now);

    let years = nowDate.getFullYear() - birthDate.getFullYear();
    let months = nowDate.getMonth() - birthDate.getMonth();
    let days = nowDate.getDate() - birthDate.getDate();

    // Adjust for negative days
    if (days < 0) {
      months--;
      const prevMonth = new Date(nowDate.getFullYear(), nowDate.getMonth(), 0);
      days += prevMonth.getDate();
    }

    // Adjust for negative months
    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate time within the current day
    const hours = nowDate.getHours();
    const minutes = nowDate.getMinutes();
    const seconds = nowDate.getSeconds();
    const milliseconds = nowDate.getMilliseconds();

    return {
      years,
      months,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      totalDays,
      totalWeeks,
      totalMilliseconds,
    };
  }, [dateOfBirth, now]);

  // Calculate life insights based on target age
  const insights = useMemo((): LifeInsights | null => {
    if (!age) return null;

    const totalTargetWeeks = targetAge * 52;
    const weeksLived = age.totalWeeks;
    const currentWeek = weeksLived + 1;
    const weeksRemaining = Math.max(0, totalTargetWeeks - weeksLived);
    const yearsRemaining = Math.max(0, targetAge - age.years);

    // Assuming 1 weekend per week
    const weekendsRemaining = weeksRemaining;

    const percentComplete = Math.min(100, (weeksLived / totalTargetWeeks) * 100);

    return {
      percentComplete,
      weeksLived,
      currentWeek,
      weeksRemaining,
      yearsRemaining,
      weekendsRemaining,
    };
  }, [age, targetAge]);

  // Format number with leading zeros
  const pad = useCallback((num: number, size: number = 2): string => {
    return String(num).padStart(size, '0');
  }, []);

  return {
    age,
    insights,
    pad,
    now,
  };
}
