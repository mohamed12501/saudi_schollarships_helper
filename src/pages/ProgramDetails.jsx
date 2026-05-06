import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePrograms } from '../hooks/usePrograms';
import { 
  ArrowLeft, 
  ExternalLink, 
  MapPin, 
  School, 
  Clock, 
  GraduationCap, 
  Languages, 
  Users, 
  CheckCircle2, 
  FileText, 
  Zap,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const ProgramDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allPrograms, loading } = usePrograms();
  const [program, setProgram] = useState(null);

  useEffect(() => {
    if (!loading && allPrograms.length > 0) {
      const found = allPrograms.find(p => p.id === id);
      if (found) {
        setProgram(found);
      }
    }
  }, [id, allPrograms, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Program Not Found</h2>
        <p className="text-slate-600 mb-8">The program you are looking for does not exist or has been removed.</p>
        <Link to="/" className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold">
          Back to Home
        </Link>
      </div>
    );
  }

  const price = program.currentPrice || program.originalPrice;
  const isDiscounted = program.currentPrice && program.originalPrice && program.currentPrice !== program.originalPrice;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
    >
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
        <ChevronRight size={14} />
        <span className="font-medium text-slate-900 truncate max-w-[200px] sm:max-w-none">
          {program.nameAr || program.nameEn}
        </span>
      </nav>

      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-600 hover:text-primary-600 font-medium mb-8 transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Results
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-[100px] -z-0 opacity-50" />
            
            <div className="relative z-10">
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-bold">
                  {program.degree}
                </span>
                {program.scholarship && program.scholarship !== 'No' && (
                  <span className={`px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1 ${
                    program.scholarship === 'منحة كاملة'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    <GraduationCap size={14} />
                    {program.scholarship}
                  </span>
                )}
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium flex items-center gap-1">
                  <Languages size={14} />
                  {program.language}
                </span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium flex items-center gap-1">
                  <Users size={14} />
                  {program.gender}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 leading-tight" dir="rtl">
                {program.nameAr}
              </h1>
              {program.nameEn && program.nameAr !== program.nameEn && (
                <p className="text-xl text-slate-500 font-medium mb-6">{program.nameEn}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="bg-primary-50 p-2 rounded-xl text-primary-600">
                    <School size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Institution</p>
                    <p className="text-lg font-bold text-slate-900">{program.institution}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary-50 p-2 rounded-xl text-primary-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</p>
                    <p className="text-lg font-bold text-slate-900">{program.city}, Saudi Arabia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          {program.benefits && program.benefits.length > 0 && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="text-amber-500" size={24} />
                <h2 className="text-2xl font-bold text-slate-900">Program Benefits</h2>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {program.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <CheckCircle2 size={18} className="text-primary-600 mt-0.5 shrink-0" />
                    <span className="text-slate-700 text-sm font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Conditions & Requirements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <FileText className="text-primary-600" size={20} />
                Conditions
              </h3>
              <ul className="space-y-3">
                {program.conditions && program.conditions.length > 0 ? (
                  program.conditions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-600 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm italic">No specific conditions listed.</p>
                )}
              </ul>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <FileText className="text-primary-600" size={20} />
                Required Attachments
              </h3>
              <ul className="space-y-3">
                {program.requiredAttachments && program.requiredAttachments.length > 0 ? (
                  program.requiredAttachments.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-600 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary-400 rounded-full" />
                      {item}
                    </li>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm italic">Standard documents required.</p>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Quick Info Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm sticky top-32">
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Program Duration</p>
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-slate-400" />
                  <span className="text-xl font-bold text-slate-900">{program.duration}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {program.scholarship === 'منحة كاملة' ? 'Scholarship Type' : 'Tuition Fees'}
                </p>
                <div className="flex items-baseline gap-2">
                  {program.scholarship === 'منحة كاملة' ? (
                    <span className="text-3xl font-extrabold text-emerald-600">Full Scholarship</span>
                  ) : (
                    <>
                      {price ? (
                        <>
                          <span className="text-3xl font-extrabold text-slate-900">{price} SAR</span>
                          {isDiscounted && (
                            <span className="text-lg text-slate-400 line-through font-medium">{program.originalPrice}</span>
                          )}
                        </>
                      ) : (
                        <span className="text-xl font-bold text-slate-900">Contact Institution</span>
                      )}
                    </>
                  )}
                </div>
                {program.scholarship === 'منحة جزئية' && (
                  <div className="mt-2 text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg inline-block">
                    Partial Scholarship Available
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-6">
                <a 
                  href={program.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-200 active:scale-[0.98]"
                >
                  Open Official Page
                  <ExternalLink size={18} />
                </a>
                <p className="text-center text-xs text-slate-400 px-4">
                  You will be redirected to the university's official application portal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProgramDetails;
