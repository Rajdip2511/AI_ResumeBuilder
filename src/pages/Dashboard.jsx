import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { generateResume } from '../utils/mistral';

const STORAGE_KEY = 'resumeData';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      const parsedData = savedData ? JSON.parse(savedData) : {
        name: '',
        skills: '',
        experience: '',
        education: '',
        achievements: '',
        customSections: []
      };
      // Ensure customSections exists and is an array
      if (!parsedData.customSections) {
        parsedData.customSections = [];
      }
      return parsedData;
    } catch (error) {
      console.error('Error parsing saved data:', error);
      return {
        name: '',
        skills: '',
        experience: '',
        education: '',
        achievements: '',
        customSections: []
      };
    }
  });
  
  const [resumeContent, setResumeContent] = useState(() => {
    return localStorage.getItem('resumeContent') || '';
  });

  useEffect(() => {
    const loadUserData = async () => {
      if (auth.currentUser) {
        try {
          const userDoc = doc(db, 'resumes', auth.currentUser.uid);
          const docSnap = await getDoc(userDoc);
          
          const defaultFormData = {
            name: '',
            skills: '',
            experience: '',
            education: '',
            achievements: '',
            customSections: []
          };

          if (docSnap.exists()) {
            const data = docSnap.data();
            const formData = data.formData || defaultFormData;
            
            // Ensure customSections exists and is an array
            if (!formData.customSections) {
              formData.customSections = [];
            }
            
            setFormData(formData);
            setResumeContent(data.resumeContent || '');
            localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
            localStorage.setItem('resumeContent', data.resumeContent || '');
          } else {
            // If no document exists, set default values without showing error
            setFormData(defaultFormData);
            setResumeContent('');
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultFormData));
            localStorage.setItem('resumeContent', '');
          }
          // Clear any existing error since data load was successful
          setError('');
        } catch (err) {
          console.error('Error loading user data:', err);
          // Only set error if it's a critical failure
          if (err.code !== 'permission-denied' && err.code !== 'not-found') {
            setError('Failed to load your resume data. Please try refreshing the page.');
          }
        }
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('resumeContent', resumeContent);
  }, [resumeContent]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCustomSection = () => {
    setFormData(prev => ({
      ...prev,
      customSections: [
        ...prev.customSections,
        { title: '', content: '' }
      ]
    }));
  };

  const handleCustomSectionChange = (index, field, value) => {
    setFormData(prev => {
      const updatedSections = [...prev.customSections];
      updatedSections[index] = {
        ...updatedSections[index],
        [field]: value
      };
      return {
        ...prev,
        customSections: updatedSections
      };
    });
  };

  const handleRemoveCustomSection = (index) => {
    setFormData(prev => ({
      ...prev,
      customSections: prev.customSections.filter((_, i) => i !== index)
    }));
  };

  const handleGenerateResume = async () => {
    setError('');
    setGenerating(true);
    
    if (!formData.name || !formData.skills || !formData.experience || !formData.education) {
      setError('Please fill in all required fields (Name, Skills, Experience, and Education)');
      setGenerating(false);
      return;
    }

    try {
      const sections = [
        formData.name && `${formData.name}`,
        formData.name && `${formData.name.toLowerCase().replace(/\s/g, '')}@email.com | linkedin.com/in/${formData.name.toLowerCase().replace(/\s/g, '-')} | San Francisco, CA | (123) 456-7890`,
        formData.skills && `SUMMARY\n${formData.skills.split(',')[0]} professional with expertise in ${formData.skills}`,
        formData.experience && `EXPERIENCE\n${formData.experience}`,
        formData.education && `EDUCATION\n${formData.education}`,
        formData.skills && `TECHNICAL SKILLS\n${formData.skills}`,
        formData.achievements && `ACHIEVEMENTS\n${formData.achievements}`,
        ...(Array.isArray(formData.customSections) ? formData.customSections.map(section => 
          section && section.title && section.content && `**${section.title.toUpperCase()}**\n${section.content}`
        ) : [])
      ].filter(Boolean);

      const generatedContent = sections.join('\n\n');
      setResumeContent(generatedContent);

      if (auth.currentUser) {
        try {
          await setDoc(doc(db, 'resumes', auth.currentUser.uid), {
            formData: {
              ...formData,
              customSections: Array.isArray(formData.customSections) ? formData.customSections : []
            },
            resumeContent: generatedContent,
            updatedAt: new Date().toISOString()
          });
        } catch (firestoreError) {
          console.error('Error saving to Firestore:', firestoreError);
        }
      }

      navigate('/preview', { state: { resumeContent: generatedContent } });
    } catch (error) {
      console.error('Error generating resume:', error);
      setError(error.message || 'Failed to generate resume. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('resumeContent');
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out. Please try again.');
    }
    setLoading(false);
  };

  const handlePreview = () => {
    navigate('/preview', { state: { resumeContent } });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">AI Resume Builder</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                disabled={loading}
                className="modern-button ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {loading ? 'Signing out...' : 'Sign out'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 animate-fade-in">
        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded relative animate-slide-up" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form Section */}
            <div className="professional-border bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="section-header">Resume Information</h2>
                <div className="space-y-4">
                  <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="modern-input mt-1 block w-full"
                    />
                  </div>

                  <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <label htmlFor="skills" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Skills <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="skills"
                      id="skills"
                      rows={3}
                      value={formData.skills}
                      onChange={handleInputChange}
                      required
                      className="modern-input mt-1 block w-full"
                      placeholder="List your key skills, separated by commas"
                    />
                  </div>

                  <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Work Experience <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="experience"
                      id="experience"
                      rows={4}
                      value={formData.experience}
                      onChange={handleInputChange}
                      required
                      className="modern-input mt-1 block w-full"
                      placeholder="Describe your work experience"
                    />
                  </div>

                  <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    <label htmlFor="education" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Education <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="education"
                      id="education"
                      rows={3}
                      value={formData.education}
                      onChange={handleInputChange}
                      required
                      className="modern-input mt-1 block w-full"
                      placeholder="List your educational background"
                    />
                  </div>

                  <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
                    <label htmlFor="achievements" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Achievements
                    </label>
                    <textarea
                      name="achievements"
                      id="achievements"
                      rows={3}
                      value={formData.achievements}
                      onChange={handleInputChange}
                      className="modern-input mt-1 block w-full"
                      placeholder="List your notable achievements (optional)"
                    />
                  </div>

                  {/* Custom Sections */}
                  {Array.isArray(formData.customSections) && formData.customSections.map((section, index) => (
                    <div key={index} className="space-y-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg relative professional-border animate-slide-up" style={{ animationDelay: `${0.6 + index * 0.1}s` }}>
                      <button
                        onClick={() => handleRemoveCustomSection(index)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 focus:outline-none transition-colors duration-200"
                        aria-label="Remove section"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={section.title || ''}
                          onChange={(e) => handleCustomSectionChange(index, 'title', e.target.value)}
                          className="modern-input mt-1 block w-full"
                          placeholder="e.g., Projects, Languages, etc."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Content
                        </label>
                        <textarea
                          value={section.content || ''}
                          onChange={(e) => handleCustomSectionChange(index, 'content', e.target.value)}
                          rows={3}
                          className="modern-input mt-1 block w-full"
                          placeholder="Describe your content here..."
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddCustomSection}
                    className="modern-button mt-4 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Custom Section
                  </button>

                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={handleGenerateResume}
                      disabled={generating}
                      className="modern-button inline-flex items-center px-6 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {generating ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating...
                        </>
                      ) : (
                        'Generate Resume'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="professional-border bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="section-header">Resume Preview</h2>
                  {resumeContent && (
                    <button
                      onClick={handlePreview}
                      className="modern-button inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-success-600 hover:bg-success-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success-500"
                    >
                      Preview & Download
                    </button>
                  )}
                </div>
                <div className="resume-preview">
                  {resumeContent ? (
                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 dark:text-gray-200 leading-relaxed animate-fade-in">
                      {resumeContent}
                    </pre>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Fill in your information and click "Generate Resume" to create your professional resume.
                      </p>
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 shadow-sm mt-8 animate-fade-in">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <span>Created by</span>
            <a 
              href="https://github.com/Rajdip2511" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
            >
              Rajdip Mandal
            </a>
            <span>&</span>
            <div className="flex items-center space-x-1">
              <svg className="h-4 w-4 text-primary-600 dark:text-primary-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              <span className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200">
                Cursor AI
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard; 