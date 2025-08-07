import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/helpers';
import { Megaphone } from 'lucide-react';

const NoticeCard = ({ notice }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-green-100 p-2 rounded-full">
            <Megaphone className="text-green-600" />
          </div>
          <p className="text-gray-600 text-sm ml-3">Published on: {formatDate(notice.publishedAt)}</p>
        </div>
        <h3 className="text-2xl font-bold mb-3 text-gray-800">{notice.title}</h3>
        <Link to={`/notices/${notice._id}`} className="font-semibold text-green-600 hover:text-green-800 transition-colors duration-300">
          Read More &rarr;
        </Link>
      </div>
    </div>
  );
};

export default NoticeCard;
