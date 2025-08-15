"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Bot, Star, Heart, Target, TrendingUp } from './ui/icons';

interface UserData {
  level: number;
  streak: number;
}

interface Goal {
  id: string;
  title: string;
  progress: number;
}

interface AICoachSectionProps {
  userData: UserData;
  goals: Goal[];
}

export function AICoachSection({ userData }: AICoachSectionProps) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: `Hello! I'm your AI Quest Coach. I see you're level ${userData.level} with a ${userData.streak}-day streak - fantastic work! 🎉`,
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: 2,
      type: 'ai',
      content: "I'm here to help you stay motivated, break down complex goals, and provide personalized advice. What would you like to work on today?",
      timestamp: new Date(Date.now() - 4 * 60 * 1000)
    }
  ]);

  const [inputValue, setInputValue] = useState('');

  const quickActions = [
    { icon: Target, label: "Goal Planning", message: "Help me plan my goals for this month" },
    { icon: TrendingUp, label: "Progress Analysis", message: "Analyze my recent progress" },
    { icon: Heart, label: "Motivation", message: "I need some motivation today" },
    { icon: Star, label: "Habit Tips", message: "Give me tips for building better habits" }
  ];

  const handleSendMessage = (messageText: string | null = null) => {
    const content = messageText || inputValue.trim();
    if (!content) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: "That's a great question! Based on your current progress, I'd recommend focusing on consistency. Small daily actions compound into amazing results over time. What specific area would you like to improve?",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          AI Quest Coach
        </h1>
        <p className="text-gray-600 mt-2">Your personal motivation and strategy assistant</p>
      </div>

      {/* Coach Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <Bot className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="font-semibold">AI Coach</div>
            <div className="text-sm text-gray-600">Available 24/7</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="font-semibold">Personalized</div>
            <div className="text-sm text-gray-600">Based on your data</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="font-semibold">Smart Insights</div>
            <div className="text-sm text-gray-600">Data-driven advice</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="font-semibold">Motivational</div>
            <div className="text-sm text-gray-600">Keeps you inspired</div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <Card className="h-96">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Chat with your AI Coach
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-72 px-6 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : ''}`}>
                  {message.type === 'ai' && (
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-purple-600" />
                    </div>
                  )}
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
                    <div className={`p-3 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-purple-600 text-white ml-auto' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {message.content}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 px-1">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                  {message.type === 'user' && (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-bold">U</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask your AI coach anything..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Button 
                onClick={() => handleSendMessage()} 
                disabled={!inputValue.trim()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Send
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start h-auto p-4 hover:bg-purple-50 hover:border-purple-200"
                  onClick={() => handleSendMessage(action.message)}
                >
                  <Icon className="w-5 h-5 mr-3 text-purple-600" />
                  <div className="text-left">
                    <div className="font-medium">{action.label}</div>
                    <div className="text-sm text-gray-600">{action.message}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Coach Insights */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Today&apos;s Insight
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-gray-700">
              Based on your current {userData.streak}-day streak, you&apos;re in the habit-formation sweet spot!
              This is the perfect time to add a complementary habit to your routine.
            </p>
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <TrendingUp className="w-3 h-3 mr-1" />
                Momentum Building
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Target className="w-3 h-3 mr-1" />
                Habit Stacking Ready
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
