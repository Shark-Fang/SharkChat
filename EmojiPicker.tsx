import React from 'react';

interface EmojiPickerProps {
  isVisible: boolean;
  onEmojiSelect: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ isVisible, onEmojiSelect }) => {
  const emojis = [
    '😀', '😂', '😊', '❤️', '👍', '🔥', '🎉', '🙏', 
    '😎', '😢', '🤔', '😍', '👋', '🦈', '🌊', '⭐'
  ];

  if (!isVisible) return null;

  return (
    <div className="emoji-picker active">
      <div className="grid grid-cols-8 gap-1">
        {emojis.map((emoji, index) => (
          <button
            key={index}
            className="emoji-btn p-1 text-xl hover:bg-gray-100 rounded"
            onClick={() => onEmojiSelect(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
