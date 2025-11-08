/**
 * ToDo List Component - Corona Inspired
 * A stateful todo list for the dashboard.
 */
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card } from './Card';
import { Input } from './Input';
import { Button } from './Button';
import { Checkbox } from './Checkbox';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

export function TodoList() {
  const [items, setItems] = useState<TodoItem[]>([
    { id: 1, text: 'Review Q1 earnings report for NVDA', completed: false },
    { id: 2, text: 'Adjust stop-loss for AAPL position', completed: true },
    { id: 3, text: 'Research new renewable energy ETFs', completed: false },
    { id: 4, text: 'Prepare for weekly portfolio review', completed: false },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleAddItem = () => {
    if (inputValue.trim() === '') return;
    const newItem: TodoItem = {
      id: Date.now(),
      text: inputValue,
      completed: false,
    };
    setItems([...items, newItem]);
    setInputValue('');
  };

  const handleToggleItem = (id: number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <Card>
      <h2 className="text-xl font-bold text-gradient mb-6">Trading To-Do List</h2>
      
      {/* Add Item Input */}
      <div className="flex gap-2 mb-6">
        <Input
          type="text"
          placeholder="Add a new task..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
          className="bg-primary-surface border-border/30 focus:border-accent-purple"
        />
        <Button onClick={handleAddItem} className="bg-gradient-purple hover:opacity-90 text-white">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Todo Items List */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center p-3 rounded-lg transition-all ${
              item.completed ? 'bg-primary-surface/50' : 'bg-primary-surface'
            }`}
          >
            <Checkbox
              id={`todo-${item.id}`}
              checked={item.completed}
              onCheckedChange={() => handleToggleItem(item.id)}
              className="mr-4 border-border/50 data-[state=checked]:bg-accent-purple"
            />
            <label
              htmlFor={`todo-${item.id}`}
              className={`flex-1 text-sm cursor-pointer ${
                item.completed ? 'line-through text-text-muted' : 'text-text-primary'
              }`}
            >
              {item.text}
            </label>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveItem(item.id)}
              className="w-8 h-8 text-text-muted hover:bg-status-danger/20 hover:text-status-danger rounded-full"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
