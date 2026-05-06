import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, School, Clock, BadgeDollarSign, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ProgramCard = ({ program }) => {
  const price = program.currentPrice || program.originalPrice;
  const isDiscounted = program.currentPrice && program.originalPrice && program.currentPrice !== program.originalPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col"
    >
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700 border border-primary-100">
            {program.degree}
          </span>
          {program.scholarship && program.scholarship !== 'No' && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              program.scholarship === 'منحة كاملة' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                : 'bg-blue-50 text-blue-700 border-blue-100'
            }`}>
              {program.scholarship}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2" dir="rtl">
          {program.nameAr || program.nameEn}
        </h3>
        
        <div className="space-y-3 mt-4">
          <div className="flex items-center gap-2 text-slate-600">
            <School size={16} className="text-slate-400" />
            <span className="text-sm font-medium">{program.institution}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin size={16} className="text-slate-400" />
            <span className="text-sm">{program.city}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Clock size={16} className="text-slate-400" />
            <span className="text-sm">{program.duration}</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between mt-auto">
        <div>
          {program.scholarship === 'منحة كاملة' ? (
            <div>
              <div className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Scholarship</div>
              <div className="text-lg font-bold text-emerald-700">Full Scholarship</div>
            </div>
          ) : (
            <>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                {program.scholarship === 'منحة جزئية' ? 'Price (Partial)' : 'Starting from'}
              </div>
              <div className="flex items-baseline gap-2">
                {price ? (
                  <>
                    <span className="text-lg font-bold text-slate-900">{price} SAR</span>
                    {isDiscounted && (
                      <span className="text-sm text-slate-400 line-through">{program.originalPrice}</span>
                    )}
                  </>
                ) : (
                  <span className="text-sm font-medium text-slate-500 italic">Contact for pricing</span>
                )}
              </div>
            </>
          )}
        </div>
        
        <Link 
          to={`/program/${program.id}`}
          className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-xl transition-colors group"
        >
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

export default ProgramCard;
