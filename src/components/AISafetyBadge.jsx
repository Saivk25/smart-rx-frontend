import React, { useState } from 'react';
import { Shield, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export default function AISafetyBadge({
  status,
  message,
  interactions = [],
  size = 'md',
  showDetails = true
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'safe':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-300',
          icon: Shield,
          label: 'Safe',
          detailBg: 'bg-green-50',
          detailBorder: 'border-green-200'
        };
      case 'warning':
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-300',
          icon: AlertTriangle,
          label: 'Warning',
          detailBg: 'bg-yellow-50',
          detailBorder: 'border-yellow-200'
        };
      case 'danger':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-300',
          icon: AlertCircle,
          label: 'Risk',
          detailBg: 'bg-red-50',
          detailBorder: 'border-red-200'
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-300',
          icon: Info,
          label: 'Unknown',
          detailBg: 'bg-gray-50',
          detailBorder: 'border-gray-200'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="relative inline-block">
      <button
        onClick={() => showDetails && setIsExpanded(!isExpanded)}
        className={`${config.bgColor} ${config.textColor} ${sizeClasses[size]} rounded-full font-semibold flex items-center gap-1.5 border-2 ${config.borderColor} transition-all ${
          showDetails ? 'hover:shadow-md cursor-pointer' : 'cursor-default'
        }`}
      >
        <Icon className={iconSizes[size]} />
        {config.label}
        {showDetails && <Info className={`${iconSizes[size]} opacity-60`} />}
      </button>

      {isExpanded && showDetails && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsExpanded(false)}
          />
          <div className={`absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border-2 ${config.borderColor} z-50 overflow-hidden`}>
            <div className={`${config.detailBg} border-b-2 ${config.detailBorder} p-4 flex items-start justify-between`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 ${config.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${config.textColor}`} />
                </div>
                <div>
                  <h3 className={`font-bold ${config.textColor} mb-1`}>
                    {status === 'safe' ? 'No Issues Detected' : status === 'warning' ? 'Please Review' : 'Action Required'}
                  </h3>
                  <p className={`text-sm ${config.textColor} opacity-80`}>
                    AI Safety Analysis
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                className={`w-8 h-8 hover:bg-white/50 rounded-lg flex items-center justify-center transition`}
              >
                <X className={`w-4 h-4 ${config.textColor}`} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {message && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-600 uppercase mb-2">Summary</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{message}</p>
                </div>
              )}

              {interactions.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-600 uppercase mb-2">
                    Potential Interactions ({interactions.length})
                  </h4>
                  <ul className="space-y-2">
                    {interactions.map((interaction, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span>{interaction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {status !== 'safe' && (
                <div className={`${config.detailBg} rounded-lg p-3 border ${config.detailBorder}`}>
                  <p className={`text-xs ${config.textColor} font-medium`}>
                    {status === 'warning'
                      ? 'Consult your healthcare provider if you have concerns about these interactions.'
                      : 'Contact your doctor or pharmacist immediately before taking this medication.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

