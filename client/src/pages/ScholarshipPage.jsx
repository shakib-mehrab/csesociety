/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { FileText, ClipboardList, CheckCircle, X, Award } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import ScholarshipApplicationForm from '../components/Scholarship/ScholarshipApplicationForm';

const ScholarshipPage = () => {
  const [scholarships, setScholarships] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(null); // { id, type }
  const [showApply, setShowApply] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/scholarships').then(res => setScholarships(res.data));
  }, []);

  const openDetailModal = (id, type) => {
    setSelectedDetail({ id, type });
  };

  const closeDetailModal = () => {
    setSelectedDetail(null);
  };

  const selectedScholarship = selectedDetail
    ? scholarships.find(s => s._id === selectedDetail.id)
    : null;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 bg-[#f5faff] min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 flex items-center gap-3 text-[#01457e]">
        <Award className="text-[#6aa9d0]" size={32} /> Available Scholarships
      </h1>

      {scholarships.length === 0 ? (
        <div className="text-center text-[#004983] italic">No scholarships available right now.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {scholarships.map(s => (
            <div
              key={s._id}
              className="bg-white rounded-xl shadow-md border border-[#01457e] p-6 hover:shadow-xl transition duration-200"
            >
              <h2 className="text-xl font-semibold text-[#002147] mb-3">{s.name}</h2>
              <div className="flex flex-col gap-2 mb-4">
                <button
                  onClick={() => openDetailModal(s._id, 'elig')}
                  className="flex items-center gap-2 text-[#01457e] hover:text-[#002147] font-medium"
                >
                  <FileText size={18} /> View Eligibility
                </button>
                <button
                  onClick={() => openDetailModal(s._id, 'rules')}
                  className="flex items-center gap-2 text-[#01457e] hover:text-[#002147] font-medium"
                >
                  <ClipboardList size={18} /> View Rules & Regulations
                </button>
              </div>
              <button
                onClick={() => setShowApply(s._id)}
                className="bg-[#01457e] hover:bg-[#002147] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
              >
                <CheckCircle size={18} /> Apply Now
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedDetail && selectedScholarship && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn"
          onClick={closeDetailModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="detailModalTitle"
          style={{
            backgroundColor: 'rgba(0 33 71 / 0.25)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg relative animate-slideUp max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-[#01457e] hover:text-[#002147] transition"
              onClick={closeDetailModal}
              aria-label="Close details modal"
            >
              <X size={20} />
            </button>

            <h3
              id="detailModalTitle"
              className="font-bold text-2xl mb-4 text-[#01457e] flex items-center gap-2 sticky top-0 bg-white pt-4"
              style={{ zIndex: 10 }}
            >
              {selectedDetail.type === 'elig' ? (
                <>
                  <FileText size={24} /> Eligibility Criteria
                </>
              ) : (
                <>
                  <ClipboardList size={24} /> Rules & Regulations
                </>
              )}
            </h3>
            <p className="text-[#002147] whitespace-pre-line">
              {selectedDetail.type === 'elig'
                ? selectedScholarship.eligibility
                : selectedScholarship.rules}
            </p>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showApply && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="applyModalTitle"
          onClick={() => setShowApply(false)}
          style={{
            backgroundColor: 'rgba(0 33 71 / 0.25)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl relative animate-slideUp overflow-auto max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-[#01457e] hover:text-[#002147] transition"
              onClick={() => setShowApply(false)}
              aria-label="Close application modal"
            >
              <X size={20} />
            </button>
            <h3
              id="applyModalTitle"
              className="font-bold text-2xl mb-6 text-[#01457e] flex items-center gap-2 sticky top-0 bg-white pt-4"
              style={{ zIndex: 10 }}
            >
              <CheckCircle size={26} /> Apply for Scholarship
            </h3>
            <ScholarshipApplicationForm
              scholarshipId={showApply}
              onClose={() => setShowApply(false)}
            />
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ScholarshipPage;
