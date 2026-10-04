import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import {
  HelpCircle,
  KeyRound,
  CreditCard,
  ScanFace,
  ReceiptText,
  CalendarCheck,
  ExternalLink,
  Youtube,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Phone,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  MessageSquareHeart
} from 'lucide-react';

interface FaqSectionProps {
  onBackToMenu?: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onBackToMenu }) => {
  const { faq, brand } = contentData;
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [feedbackStatus, setFeedbackStatus] = useState<'prompt' | 'resolved' | 'unresolved' | 'ended'>('prompt');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const selectedTopic = faq.topics.find((t) => t.id === selectedTopicId);

  const handleSelectTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    setActiveStepIndex(0);
    setFeedbackStatus('prompt');
  };

  const handleBack = () => {
    setSelectedTopicId(null);
    setActiveStepIndex(0);
    setFeedbackStatus('prompt');
    if (onBackToMenu) onBackToMenu();
  };

  const getTopicIcon = (id: string) => {
    switch (id) {
      case 'quen-mat-khau':
        return <KeyRound className="w-7 h-7 text-amber-500" />;
      case 'dong-the':
        return <CreditCard className="w-7 h-7 text-rose-500" />;
      case 'sinh-trac-hoc':
        return <ScanFace className="w-7 h-7 text-blue-600" />;
      case 'nop-thue':
        return <ReceiptText className="w-7 h-7 text-emerald-600" />;
      case 'dat-lich':
        return <CalendarCheck className="w-7 h-7 text-purple-600" />;
      default:
        return <HelpCircle className="w-7 h-7 text-blue-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn">
      {/* If No Topic Selected: Show The 4 Core Cards (+ Appointment Booking) */}
      {!selectedTopic ? (
        <div className="space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#003B70] text-xs font-bold uppercase tracking-wider mb-3">
              <HelpCircle className="w-4 h-4 text-[#ED1C24]" />
              Trung Tâm Hỗ Trợ Khách Hàng Tại Quầy
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#003B70] tracking-tight">
              {faq.question}
            </h1>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Chọn nội dung Quý khách cần hướng dẫn để xem từng bước thao tác có hình ảnh thực tế và video minh họa chi tiết.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
            {faq.topics.map((topic, index) => (
              <div
                key={topic.id}
                onClick={() => handleSelectTopic(topic.id)}
                className="group relative bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-[#003B70] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-slate-50 group-hover:bg-blue-50 group-hover:scale-110 transition-all duration-300 shadow-inner">
                    {getTopicIcon(topic.id)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-[#003B70] group-hover:text-white transition-colors">
                        Mục 0{index + 1}
                      </span>
                      {topic.steps && (
                        <span className="text-xs text-slate-500 font-medium">
                          {topic.steps.length} bước thực hiện
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#003B70] mt-2 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                      {topic.shortDesc}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#003B70] group-hover:text-[#ED1C24] transition-colors">
                  <span className="flex items-center gap-1.5">
                    Xem hướng dẫn chi tiết
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#ED1C24] group-hover:text-white flex items-center justify-center transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Support Banner */}
          <div className="bg-gradient-to-r from-[#003B70] to-[#00549A] text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                <Phone className="w-5 h-5 text-amber-400" />
                Cần Hỗ Trợ Trực Tiếp Tại Quầy?
              </h3>
              <p className="text-sm text-sky-100 max-w-xl">
                Quý khách có thể liên hệ ngay Chuyên viên tư vấn <strong className="text-amber-300">{brand.advisor.name}</strong> tại quầy hoặc gọi điện để được hỗ trợ nhanh nhất.
              </p>
            </div>
            <a
              href={`tel:${brand.advisor.phone}`}
              className="shrink-0 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl shadow-md hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-slate-900" />
              Gọi {brand.advisor.phoneFormatted}
            </a>
          </div>
        </div>
      ) : (
        /* DETAIL STEP-BY-STEP VIEW FOR SELECTED TOPIC */
        <div className="space-y-6">
          {/* Header Action Bar */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 text-sm font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại danh sách</span>
              </button>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#003B70]">
                  {selectedTopic.title}
                </h2>
                <p className="text-xs text-slate-500">
                  Tổng cộng: {selectedTopic.steps.length} bước thực hiện
                </p>
              </div>
            </div>

            {/* Direct YouTube Video Button */}
            {selectedTopic.youtubeUrl && (
              <a
                href={selectedTopic.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow hover:scale-105 transition-all cursor-pointer"
              >
                <Youtube className="w-4 h-4" />
                <span>Xem Video Hướng Dẫn YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Stepper Navigator Pills */}
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 overflow-x-auto flex items-center gap-2 scrollbar-none">
            {selectedTopic.steps.map((step, idx) => (
              <button
                key={step.step}
                onClick={() => setActiveStepIndex(idx)}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeStepIndex === idx
                    ? 'bg-[#003B70] text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Bước {step.step}
              </button>
            ))}
          </div>

          {/* Main Active Step Showcase */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Step text & instructions */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#003B70] text-xs font-extrabold">
                Bước {selectedTopic.steps[activeStepIndex].step} / {selectedTopic.steps.length}
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {selectedTopic.steps[activeStepIndex].title}
              </h3>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-base leading-relaxed">
                {selectedTopic.steps[activeStepIndex].content}
              </div>

              {/* Prev / Next controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3">
                <button
                  disabled={activeStepIndex === 0}
                  onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Bước trước
                </button>

                <div className="text-xs text-slate-500 font-medium">
                  {activeStepIndex + 1} của {selectedTopic.steps.length}
                </div>

                <button
                  disabled={activeStepIndex === selectedTopic.steps.length - 1}
                  onClick={() => setActiveStepIndex((prev) => Math.min(selectedTopic.steps.length - 1, prev + 1))}
                  className="px-4 py-2.5 rounded-xl bg-[#003B70] text-white font-semibold text-sm hover:bg-[#002B52] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  Bước tiếp theo
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Step Image with Zoom */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div
                onClick={() => setZoomedImage(selectedTopic.steps[activeStepIndex].imageUrl)}
                className="relative group w-full max-w-md bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-md cursor-pointer hover:border-[#003B70] transition-all"
              >
                <img
                  src={selectedTopic.steps[activeStepIndex].imageUrl}
                  alt={`Minh họa bước ${selectedTopic.steps[activeStepIndex].step}`}
                  className="w-full h-80 sm:h-96 object-contain bg-white group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://raw.githubusercontent.com/giadinhbanker/anh-super-app-bac-phu-tho/main/Logo%20VietinBank.png';
                  }}
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-semibold text-sm backdrop-blur-[2px]">
                  <ZoomIn className="w-5 h-5" />
                  <span>Bấm để phóng to ảnh</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2 italic text-center">
                * Hình ảnh giao diện thực tế trên ứng dụng VietinBank iPay
              </p>
            </div>
          </div>

          {/* Feedback & Interaction Section (Strict Requirements from PDF) */}
          <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
            <div className="flex items-center gap-3">
              <MessageSquareHeart className="w-6 h-6 text-[#ED1C24]" />
              <h4 className="text-lg font-bold text-slate-900">
                {faq.feedbackPrompt}
              </h4>
            </div>

            {/* Buttons for Customer Feedback */}
            {feedbackStatus === 'prompt' && (
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setFeedbackStatus('resolved')}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Đã ổn, tôi hiểu rồi
                </button>

                <button
                  onClick={() => setFeedbackStatus('unresolved')}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
                >
                  <AlertCircle className="w-4 h-4" />
                  Chưa ổn, cần hỗ trợ thêm
                </button>

                <button
                  onClick={() => setFeedbackStatus('ended')}
                  className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-800 text-white font-bold text-sm shadow transition-all cursor-pointer"
                >
                  Kết thúc cuộc trò chuyện
                </button>
              </div>
            )}

            {/* Resolved state */}
            {feedbackStatus === 'resolved' && (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3">
                <p className="font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Tuyệt vời! Cảm ơn Quý khách. Quý khách có muốn chọn hướng dẫn khác không?
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleBack}
                    className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors cursor-pointer"
                  >
                    Quay lại menu chính
                  </button>
                  <button
                    onClick={() => setFeedbackStatus('ended')}
                    className="px-5 py-2.5 rounded-xl bg-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-300 transition-colors cursor-pointer"
                  >
                    Kết thúc cuộc trò chuyện
                  </button>
                </div>
              </div>
            )}

            {/* Unresolved state (advisor support message as specified in PDF) */}
            {feedbackStatus === 'unresolved' && (
              <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-300 text-slate-800 space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-base font-semibold leading-relaxed text-slate-900">
                      {faq.advisorSupportMessage}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={`tel:${brand.advisor.phone}`}
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow flex items-center gap-2 cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                    Gọi ngay {brand.advisor.name} ({brand.advisor.phoneFormatted})
                  </a>
                  <button
                    onClick={handleBack}
                    className="px-5 py-2.5 rounded-xl bg-[#003B70] text-white font-bold text-xs hover:bg-[#00274D] cursor-pointer"
                  >
                    Quay lại menu chính
                  </button>
                  <button
                    onClick={() => setFeedbackStatus('ended')}
                    className="px-5 py-2.5 rounded-xl bg-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-300 cursor-pointer"
                  >
                    Kết thúc cuộc trò chuyện
                  </button>
                </div>
              </div>
            )}

            {/* Ended state (as specified in PDF) */}
            {feedbackStatus === 'ended' && (
              <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 text-[#003B70] space-y-4">
                <p className="text-lg font-bold">
                  {faq.endConversationMessage}
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleBack}
                    className="px-5 py-2.5 rounded-xl bg-[#003B70] text-white font-bold text-xs hover:bg-[#00274D] transition-colors cursor-pointer"
                  >
                    Quay lại menu chính
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-white p-3 rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center"
          >
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={zoomedImage}
              alt="Phóng to minh họa"
              className="max-h-[82vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
