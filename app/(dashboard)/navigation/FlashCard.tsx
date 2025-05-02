import { 
    User, 
    Bed, 
    FileText, 
    Globe, 
    Clock, 
    AlertCircle, 
    Phone, 
    AlertTriangle, 
    Accessibility, 
    MapPin, 
    X,
    Calendar,
    Info
  } from 'lucide-react';
  
  interface FlashCardProps {
    address?: string | null;
    lat?: number;
    lon?: number;
    name?: string;
    openingHours?: string | null;
    covidHours?: string | null;
    phone?: string | null;
    website?: string | null;
    wheelchair?: string | null;
    emergency?: string | null;
    operator?: string | null;
    beds?: string | null;
    insurance?: string | null;
    languages?: string | null;
    speciality?: string | null;
    onClose: () => void;
    isOpen: boolean;
  }
  
  export default function FlashCard({
    address,
    lat,
    lon,
    name = "Healthcare Facility",
    openingHours,
    covidHours,
    phone,
    website,
    wheelchair,
    emergency,
    operator,
    beds,
    insurance,
    languages,
    speciality,
    onClose,
    isOpen
  }: FlashCardProps) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="relative w-full max-w-md bg-black border border-green-400 rounded-xl shadow-2xl overflow-hidden">
          {/* Header with facility name */}
          <div className="relative p-3 sm:p-4 bg-green-400 text-black">
            <h3 className="text-lg sm:text-xl font-bold pr-8 truncate">{name}</h3>
            <button 
              onClick={onClose}
              className="absolute  top-3 sm:top-4 right-0 sm:right-4 p-1 rounded-full hover:bg-green-500 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
  
          {/* Content */}
          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 max-h-72 sm:max-h-96 overflow-y-auto text-sm sm:text-base">
            {/* Main information */}
            <div className="space-y-3">
              {address && (
                <div className="flex items-start">
                  <MapPin className="mr-2 sm:mr-3 flex-shrink-0 mt-1" size={18} color="#10B981" />
                  <div>
                    <p className="text-xs sm:text-sm text-green-400 font-medium mb-0.5 sm:mb-1">Address</p>
                    <p className="text-white break-words">{address}</p>
                  </div>
                </div>
              )}
  
              {speciality && (
                <div className="flex items-start">
                  <User className="mr-2 sm:mr-3 flex-shrink-0 mt-1" size={18} color="#10B981" />
                  <div>
                    <p className="text-xs sm:text-sm text-green-400 font-medium mb-0.5 sm:mb-1">Speciality</p>
                    <p className="text-white">{speciality}</p>
                  </div>
                </div>
              )}
  
              {openingHours && (
                <div className="flex items-start">
                  <Clock className="mr-2 sm:mr-3 flex-shrink-0 mt-1" size={18} color="#10B981" />
                  <div>
                    <p className="text-xs sm:text-sm text-green-400 font-medium mb-0.5 sm:mb-1">Opening Hours</p>
                    <p className="text-white">{openingHours}</p>
                  </div>
                </div>
              )}
  
              {covidHours && (
                <div className="flex items-start">
                  <Calendar className="mr-2 sm:mr-3 flex-shrink-0 mt-1" size={18} color="#EC4899" />
                  <div>
                    <p className="text-xs sm:text-sm text-pink-400 font-medium mb-0.5 sm:mb-1">COVID-19 Hours</p>
                    <p className="text-white">{covidHours}</p>
                  </div>
                </div>
              )}
  
              {emergency && (
                <div className="flex items-start">
                  <AlertTriangle 
                    className="mr-2 sm:mr-3 flex-shrink-0 mt-1" 
                    size={18} 
                    color={emergency.toLowerCase() === "yes" ? "#EF4444" : "#6B7280"} 
                  />
                  <div>
                    <p className="text-xs sm:text-sm text-red-400 font-medium mb-0.5 sm:mb-1">Emergency Services</p>
                    <p className={`${emergency.toLowerCase() === "yes" ? "text-red-500 font-medium" : "text-white"}`}>
                      {emergency.toLowerCase() === "yes" ? "Available" : "Not Available"}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Contact information */}
            {(phone || website) && (
              <div className="border-t border-green-800 pt-3 sm:pt-4 mt-3 sm:mt-4">
                <h4 className="text-green-400 text-sm sm:text-base font-medium mb-2 sm:mb-3 flex items-center">
                  <Info size={14} className="mr-1 sm:mr-2" />
                  Contact Information
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  {phone && (
                    <div className="flex items-center">
                      <Phone className="mr-2 sm:mr-3 flex-shrink-0" size={18} color="#10B981" />
                      <a href={`tel:${phone}`} className="text-green-400 hover:underline truncate">{phone}</a>
                    </div>
                  )}
                  
                  {website && (
                    <div className="flex items-center">
                      <Globe className="mr-2 sm:mr-3 flex-shrink-0" size={18} color="#3B82F6" />
                      <a 
                        href={website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-400 hover:underline truncate"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Additional details */}
            {(operator || beds || insurance || languages || wheelchair) && (
              <div className="border-t border-green-800 pt-3 sm:pt-4">
                <h4 className="text-green-400 text-sm sm:text-base font-medium mb-2 sm:mb-3">Additional Details</h4>
                <div className="space-y-2 sm:space-y-3">
                  {operator && (
                    <div className="flex items-start">
                      <User className="mr-2 sm:mr-3 flex-shrink-0 mt-1" size={18} color="#3B82F6" />
                      <div>
                        <p className="text-xs sm:text-sm text-green-400 font-medium mb-0.5 sm:mb-1">Operator</p>
                        <p className="text-white">{operator}</p>
                      </div>
                    </div>
                  )}
                  
                  {beds && (
                    <div className="flex items-start">
                      <Bed className="mr-2 sm:mr-3 flex-shrink-0 mt-1" size={18} color="#F59E0B" />
                      <div>
                        <p className="text-xs sm:text-sm text-green-400 font-medium mb-0.5 sm:mb-1">Beds</p>
                        <p className="text-white">{beds}</p>
                      </div>
                    </div>
                  )}
                  
                  {insurance && (
                    <div className="flex items-start">
                      <FileText className="mr-2 sm:mr-3 flex-shrink-0 mt-1" size={18} color="#8B5CF6" />
                      <div>
                        <p className="text-xs sm:text-sm text-green-400 font-medium mb-0.5 sm:mb-1">Insurance</p>
                        <p className="text-white">{insurance}</p>
                      </div>
                    </div>
                  )}
                  
                  {languages && (
                    <div className="flex items-start">
                      <Globe className="mr-2 sm:mr-3 flex-shrink-0 mt-1" size={18} color="#3B82F6" />
                      <div>
                        <p className="text-xs sm:text-sm text-green-400 font-medium mb-0.5 sm:mb-1">Languages</p>
                        <p className="text-white">{languages}</p>
                      </div>
                    </div>
                  )}
                  
                  {wheelchair && (
                    <div className="flex items-start">
                      <Accessibility className="mr-2 sm:mr-3 flex-shrink-0 mt-1" size={18} color="#6366F1" />
                      <div>
                        <p className="text-xs sm:text-sm text-green-400 font-medium mb-0.5 sm:mb-1">Wheelchair Access</p>
                        <p className="text-white">{wheelchair}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Footer with action buttons */}
          <div className="p-3 sm:p-4 bg-black border-t border-green-800 flex flex-wrap gap-2 sm:gap-4 justify-between items-center">
            {lat && lon && (
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-500 text-black text-sm sm:text-base rounded-lg font-medium hover:bg-green-600 transition-colors flex-shrink-0"
              >
                Get Directions
              </a>
            )}

            
            <button
              onClick={onClose}
              className="px-3 py-1.5 border border-green-400 text-green-400 text-sm sm:text-base rounded-lg font-medium hover:bg-green-900 hover:bg-opacity-50 transition-colors flex-shrink-0 ml-auto"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }