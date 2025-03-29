import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  platform: string;
  type: string;
  scheduled?: Date;
}

interface EditorialCalendarProps {
  contentItems: ContentItem[];
  selectedPlatforms: string[];
  onSave: (scheduledItems: ContentItem[], frequencies: Record<string, string>) => void;
}

const EditorialCalendar: React.FC<EditorialCalendarProps> = ({
  contentItems,
  selectedPlatforms,
  onSave
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [availableItems, setAvailableItems] = useState<ContentItem[]>(contentItems);
  const [scheduledItems, setScheduledItems] = useState<ContentItem[]>([]);
  const [frequencies, setFrequencies] = useState<Record<string, string>>(
    selectedPlatforms.reduce((acc, platform) => {
      acc[platform] = 'Weekly';
      return acc;
    }, {} as Record<string, string>)
  );

  // Calendar generation functions
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const prevMonthDays = month === 0 
      ? getDaysInMonth(year - 1, 11) 
      : getDaysInMonth(year, month - 1);
    
    const days = [];
    
    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        currentMonth: false,
        date: new Date(year, month - 1, prevMonthDays - i)
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        currentMonth: true,
        date: new Date(year, month, i)
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        currentMonth: false,
        date: new Date(year, month + 1, i)
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  
  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const handleDateSelect = (day: number) => {
    setSelectedDate(day);
  };

  const handleAddToCalendar = (item: ContentItem) => {
    if (!selectedDate) return;
    
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      selectedDate
    );
    
    const scheduledItem = { ...item, scheduled: newDate };
    
    setScheduledItems(prev => [...prev, scheduledItem]);
    setAvailableItems(prev => prev.filter(i => i.id !== item.id));
  };

  const handleRemoveFromCalendar = (itemId: string) => {
    const item = scheduledItems.find(i => i.id === itemId);
    if (!item) return;
    
    const originalItem = { ...item };
    delete originalItem.scheduled;
    
    setAvailableItems(prev => [...prev, originalItem]);
    setScheduledItems(prev => prev.filter(i => i.id !== itemId));
  };

  const handleFrequencyChange = (platform: string, frequency: string) => {
    setFrequencies(prev => ({
      ...prev,
      [platform]: frequency
    }));
  };

  const handleSave = () => {
    onSave(scheduledItems, frequencies);
  };

  const getItemsForSelectedDate = () => {
    if (!selectedDate) return [];
    
    const selectedDateObj = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      selectedDate
    );
    
    return scheduledItems.filter(item => {
      if (!item.scheduled) return false;
      
      const itemDate = new Date(item.scheduled);
      return (
        itemDate.getDate() === selectedDateObj.getDate() &&
        itemDate.getMonth() === selectedDateObj.getMonth() &&
        itemDate.getFullYear() === selectedDateObj.getFullYear()
      );
    });
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };

  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Editorial Calendar Planning</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Date</h2>
          <p className="text-gray-600 text-sm mb-4">Choose dates for your content</p>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={handlePrevMonth}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h3 className="text-lg font-medium text-gray-800 capitalize">
                {formatMonthYear(currentMonth)}
              </h3>
              <button 
                onClick={handleNextMonth}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {weekdays.map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                  {day}
                </div>
              ))}
              
              {calendarDays.map((day, index) => (
                <button
                  key={index}
                  onClick={() => day.currentMonth && handleDateSelect(day.day)}
                  className={`
                    h-10 w-full rounded-md flex items-center justify-center text-sm
                    ${!day.currentMonth ? 'text-gray-400' : 'text-gray-800'}
                    ${selectedDate === day.day && day.currentMonth ? 'bg-blue-500 text-white' : ''}
                    ${day.currentMonth && selectedDate !== day.day ? 'hover:bg-gray-100' : ''}
                    ${getItemsForSelectedDate().length > 0 && selectedDate === day.day ? 'ring-2 ring-blue-500' : ''}
                  `}
                >
                  {day.day}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Available Content Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Available Content</h2>
          <p className="text-gray-600 text-sm mb-4">Drag items to the calendar</p>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {availableItems.map(item => (
              <div 
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleAddToCalendar(item)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-800">{item.title}</h3>
                  <button 
                    className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCalendar(item);
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                    {item.platform}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
                    {item.type}
                  </span>
                </div>
              </div>
            ))}
            {availableItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                All content has been scheduled
              </div>
            )}
          </div>
        </div>

        {/* Calendar Items Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Calendar Items</h2>
          <p className="text-gray-600 text-sm mb-4">Your scheduled content</p>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {getItemsForSelectedDate().length > 0 ? (
              getItemsForSelectedDate().map(item => (
                <div 
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-800">{item.title}</h3>
                    <button 
                      className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                      onClick={() => handleRemoveFromCalendar(item.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                      {item.platform}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
                      {item.type}
                    </span>
                  </div>
                  {item.scheduled && (
                    <div className="mt-2 text-sm text-gray-600">
                      {item.scheduled.toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))
            ) : selectedDate ? (
              <div className="text-center py-8 text-gray-500">
                No content scheduled for this date
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Select a date to see scheduled content
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Frequency Settings */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Content Frequency Settings</h2>
        <p className="text-gray-600 text-sm mb-4">Set how often you want to post on each platform</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.keys(frequencies).map(platform => (
            <div key={platform} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">{platform}</label>
              <select
                value={frequencies[platform]}
                onChange={(e) => handleFrequencyChange(platform, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Bi-Weekly">Bi-Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200"
        >
          Reset
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
        >
          Save Calendar
        </button>
      </div>
    </div>
  );
};

export default EditorialCalendar;