"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Target, CheckCircle, Clock, Plus } from './ui/icons';

interface Goal {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  completed: boolean;
}

interface Task {
  id: string;
  title: string;
  category: string;
  completed: boolean;
}

interface CalendarEvent {
  type: string;
  title: string;
  category: string;
  id: string;
  completed: boolean;
}

interface CalendarSectionProps {
  goals: Goal[];
  tasks: Task[];
}

export function CalendarSection({ goals, tasks }: CalendarSectionProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');

  // Generate calendar events from goals and tasks
  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const events: CalendarEvent[] = [];

    // Add goal deadlines
    goals.forEach(goal => {
      if (goal.dueDate === dateStr) {
        events.push({
          type: 'goal-deadline',
          title: goal.title,
          category: goal.category,
          id: goal.id,
          completed: goal.completed
        });
      }
    });

    // Add recurring tasks (simplified logic)
    tasks.forEach(task => {
      if (task.category === 'health' || task.category === 'education') {
        events.push({
          type: 'recurring-task',
          title: task.title,
          category: task.category,
          id: task.id,
          completed: task.completed
        });
      }
    });

    return events;
  };

  const getUpcomingEvents = () => {
    const upcoming = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const events = getEventsForDate(date);
      if (events.length > 0) {
        upcoming.push({ date, events });
      }
    }
    return upcoming;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health': return 'bg-green-100 text-green-800 border-green-200';
      case 'finance': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'education': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'career': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'relationships': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'personal': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const selectedEvents = getEventsForDate(selectedDate);
  const upcomingEvents = getUpcomingEvents();

  // Simple calendar grid
  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quest Calendar</h1>
          <p className="text-gray-600">Track your goals and milestones over time</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className={viewMode === 'month' ? 'bg-purple-100' : ''} onClick={() => setViewMode('month')}>
            Month
          </Button>
          <Button variant="outline" size="sm" className={viewMode === 'week' ? 'bg-purple-100' : ''} onClick={() => setViewMode('week')}>
            Week
          </Button>
        </div>
      </div>

      {/* Main Calendar Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, index) => {
                  const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
                  const isToday = date.toDateString() === new Date().toDateString();
                  const isSelected = date.toDateString() === selectedDate.toDateString();
                  const hasEvents = getEventsForDate(date).length > 0;

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      className={`p-2 text-sm rounded-lg transition-colors ${
                        !isCurrentMonth 
                          ? 'text-gray-300' 
                          : isSelected
                          ? 'bg-purple-600 text-white'
                          : isToday
                          ? 'bg-purple-100 text-purple-600 font-bold'
                          : hasEvents
                          ? 'bg-purple-50 text-purple-600 font-medium'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {date.getDate()}
                      {hasEvents && (
                        <div className="w-1 h-1 bg-purple-500 rounded-full mx-auto mt-1"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Day & Upcoming */}
        <div className="space-y-4">
          {/* Selected Day Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedEvents.map((event, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <Badge variant="outline" className={getCategoryColor(event.category)}>
                            {event.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          {event.type === 'goal-deadline' ? (
                            <Target className="w-4 h-4 text-purple-500" />
                          ) : (
                            <Clock className="w-4 h-4 text-blue-500" />
                          )}
                          {event.completed && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        {event.type === 'goal-deadline' ? 'Goal deadline' : 'Recurring task'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No events for this day</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Plus className="w-3 h-3 mr-1" />
                    Add Event
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.slice(0, 5).map((day, index) => (
                    <div key={index}>
                      <div className="text-sm font-medium text-gray-600 mb-2">
                        {day.date.toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="space-y-2">
                        {day.events.map((event, eventIndex) => (
                          <div key={eventIndex} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            {event.type === 'goal-deadline' ? (
                              <Target className="w-3 h-3 text-purple-500 flex-shrink-0" />
                            ) : (
                              <Clock className="w-3 h-3 text-blue-500 flex-shrink-0" />
                            )}
                            <span className="text-sm font-medium truncate">{event.title}</span>
                            <Badge variant="outline" className={`text-xs ${getCategoryColor(event.category)}`}>
                              {event.category}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-600">
                  <p className="text-sm">No upcoming events</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Calendar Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-600">Total events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goal Deadlines</CardTitle>
            <Target className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-gray-600">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-gray-600">Events completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67%</div>
            <p className="text-xs text-gray-600">This month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
