import { useLocation, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import * as htmlToImage from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const THEMES = {
  JANNA: 'janna',    // Clean, minimal design with underlined sections
  JOHNNY: 'johnny',  // Orange-themed with right-aligned sections
  MILAN: 'milan'     // Modern design with yellow accents and icons
};

const ResumePreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resumeRef = useRef();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(THEMES.JANNA);
  const { resumeContent } = location.state || { resumeContent: '' };

  useEffect(() => {
    setEditedContent(resumeContent);
  }, [resumeContent]);

  const getThemeStyles = (theme) => {
    switch (theme) {
      case THEMES.JOHNNY:
        return {
          container: {
            fontFamily: '"Inter", "Segoe UI", Arial, sans-serif',
            padding: '50px 60px',
            color: '#2d3748',
            background: 'white',
            position: 'relative',
          },
          header: {
            marginBottom: '35px',
            borderBottom: '2px solid #3182ce',
            paddingBottom: '20px',
          },
          name: {
            fontSize: '32px',
            color: '#2d3748',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            textAlign: 'center',
            marginBottom: '12px',
          },
          contact: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '15px',
            fontSize: '13px',
            color: '#4a5568',
            '& > *': {
              display: 'inline-flex',
              alignItems: 'center',
            },
          },
          sectionTitle: {
            color: '#3182ce',
            textTransform: 'uppercase',
            fontSize: '16px',
            fontWeight: '600',
            letterSpacing: '0.05em',
            marginTop: '25px',
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            '&::after': {
              content: '""',
              flex: '1',
              height: '2px',
              background: '#e2e8f0',
              marginLeft: '15px',
            },
          },
          content: {
            display: 'grid',
            gap: '20px',
          },
          listItem: {
            fontSize: '13px',
            marginBottom: '10px',
            paddingLeft: '20px',
            position: 'relative',
            lineHeight: '1.6',
            color: '#4a5568',
            '&::before': {
              content: '"•"',
              position: 'absolute',
              left: '0',
              color: '#3182ce',
              fontWeight: 'bold',
            },
          },
          skillsSection: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            marginTop: '10px',
          },
          skillCategory: {
            fontSize: '13px',
            color: '#4a5568',
            marginBottom: '5px',
            fontWeight: '600',
          },
          skillList: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
          },
          skill: {
            background: '#ebf8ff',
            color: '#3182ce',
            padding: '4px 12px',
            borderRadius: '15px',
            fontSize: '12px',
            fontWeight: '500',
          },
          experienceItem: {
            marginBottom: '20px',
          },
          experienceHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '8px',
          },
          companyName: {
            fontSize: '14px',
            fontWeight: '600',
            color: '#2d3748',
          },
          duration: {
            fontSize: '13px',
            color: '#718096',
          },
          role: {
            fontSize: '13px',
            color: '#4a5568',
            fontStyle: 'italic',
            marginBottom: '8px',
          }
        };

      case THEMES.MILAN:
        return {
          container: {
            fontFamily: '"Inter", "Segoe UI", Arial, sans-serif',
            padding: '45px 50px',
            color: '#333',
            background: 'linear-gradient(to bottom, #fff 0%, #fafafa 100%)',
            position: 'relative',
            maxWidth: '850px',
            margin: '0 auto',
            boxShadow: 'rgba(17, 12, 46, 0.15) 0px 48px 100px 0px',
            borderRadius: '8px',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '6px',
              background: 'linear-gradient(90deg, #8B4513 0%, #D2691E 100%)',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px',
            },
          },
          header: {
            marginBottom: '35px',
            borderLeft: '4px solid #8B4513',
            paddingLeft: '20px',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-15px',
              left: '0',
              width: '100%',
              height: '1px',
              background: 'linear-gradient(90deg, #8B4513 0%, transparent 100%)',
              opacity: '0.2',
            },
          },
          name: {
            fontSize: '32px',
            fontWeight: '800',
            color: '#8B4513',
            marginBottom: '15px',
            letterSpacing: '0.025em',
            textTransform: 'uppercase',
            textShadow: '1px 1px 1px rgba(139, 69, 19, 0.1)',
            position: 'relative',
            display: 'inline-block',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-4px',
              left: '0',
              width: '40%',
              height: '2px',
              background: '#8B4513',
              opacity: '0.3',
            },
          },
          contact: {
            fontSize: '13px',
            color: '#666',
            display: 'flex',
            gap: '20px',
            marginBottom: '25px',
            alignItems: 'center',
            flexWrap: 'wrap',
            position: 'relative',
            paddingTop: '10px',
          },
          contactItem: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#666',
            transition: 'all 0.3s ease',
            padding: '4px 12px',
            borderRadius: '4px',
            background: 'rgba(139, 69, 19, 0.03)',
            border: '1px solid rgba(139, 69, 19, 0.08)',
            '&:hover': {
              color: '#8B4513',
              background: 'rgba(139, 69, 19, 0.08)',
              transform: 'translateY(-1px)',
              boxShadow: '0 2px 4px rgba(139, 69, 19, 0.1)',
            },
          },
          section: {
            marginBottom: '35px',
            position: 'relative',
            padding: '20px 25px',
            background: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '8px',
            boxShadow: 'rgba(139, 69, 19, 0.04) 0px 4px 16px, rgba(17, 17, 26, 0.03) 0px 8px 32px',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(139, 69, 19, 0.08)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 'rgba(139, 69, 19, 0.06) 0px 8px 24px, rgba(17, 17, 26, 0.05) 0px 16px 56px',
            },
          },
          sectionTitle: {
            fontSize: '16px',
            fontWeight: '700',
            color: '#333',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '25px',
            position: 'relative',
            paddingLeft: '35px',
            letterSpacing: '0.05em',
            '&::after': {
              content: '""',
              flex: '1',
              height: '1px',
              background: 'linear-gradient(90deg, #8B4513 0%, transparent 100%)',
              opacity: '0.2',
            },
          },
          sectionIcon: {
            position: 'absolute',
            left: '0',
            width: '26px',
            height: '26px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#8B4513',
            borderRadius: '6px',
            color: 'white',
            fontSize: '13px',
            boxShadow: '0 4px 6px rgba(139, 69, 19, 0.2)',
            transform: 'rotate(-5deg)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'rotate(0deg) scale(1.05)',
              boxShadow: '0 6px 8px rgba(139, 69, 19, 0.25)',
            },
          },
          content: {
            fontSize: '14px',
            lineHeight: '1.8',
            color: '#444',
            position: 'relative',
            zIndex: '1',
            '& a': {
              color: '#8B4513',
              textDecoration: 'none',
              borderBottom: '1px dashed rgba(139, 69, 19, 0.3)',
              transition: 'all 0.2s ease',
              '&:hover': {
                color: '#D2691E',
                borderBottom: '1px solid rgba(210, 105, 30, 0.5)',
              },
            },
          },
          listItem: {
            position: 'relative',
            paddingLeft: '22px',
            marginBottom: '12px',
            transition: 'all 0.3s ease',
            background: 'transparent',
            borderRadius: '4px',
            padding: '8px 12px 8px 25px',
            '&:hover': {
              background: 'rgba(139, 69, 19, 0.03)',
              transform: 'translateX(5px)',
              boxShadow: '2px 2px 4px rgba(139, 69, 19, 0.05)',
            },
            '&::before': {
              content: '"•"',
              position: 'absolute',
              left: '8px',
              color: '#8B4513',
              fontWeight: '700',
              fontSize: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              transition: 'all 0.3s ease',
            },
            '&:hover::before': {
              transform: 'translateY(-50%) scale(1.2)',
              color: '#D2691E',
            },
          },
          highlight: {
            color: '#8B4513',
            fontWeight: '600',
            background: 'linear-gradient(120deg, rgba(139, 69, 19, 0.1) 0%, rgba(139, 69, 19, 0.05) 100%)',
            padding: '0 4px',
            borderRadius: '3px',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(120deg, rgba(139, 69, 19, 0.15) 0%, rgba(139, 69, 19, 0.08) 100%)',
            },
          },
          skillTag: {
            display: 'inline-block',
            padding: '4px 12px',
            background: 'rgba(139, 69, 19, 0.06)',
            borderRadius: '15px',
            margin: '0 8px 8px 0',
            fontSize: '13px',
            color: '#8B4513',
            border: '1px solid rgba(139, 69, 19, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(139, 69, 19, 0.1)',
              transform: 'translateY(-1px)',
              boxShadow: '0 2px 4px rgba(139, 69, 19, 0.1)',
            },
          },
        };

      default: // Clean Modern Design (Screenshot Match)
        return {
          container: {
            fontFamily: '"Poppins", sans-serif',
            padding: '40px 50px',
            color: '#333333',
            background: '#FFFFFF',
            maxWidth: '850px',
            margin: '0 auto',
          },
          name: {
            fontSize: '24px',
            fontWeight: '600',
            color: '#333333',
            marginBottom: '20px',
          },
          contact: {
            fontSize: '14px',
            color: '#666666',
            marginBottom: '30px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          },
          sectionTitle: {
            fontSize: '16px',
            fontWeight: '600',
            color: '#333333',
            textTransform: 'uppercase',
            marginBottom: '15px',
            marginTop: '25px',
          },
          content: {
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#444444',
          },
          listItem: {
            position: 'relative',
            paddingLeft: '15px',
            marginBottom: '8px',
            '&::before': {
              content: '"•"',
              position: 'absolute',
              left: '0',
              color: '#666666',
            },
          },
          experienceTitle: {
            fontSize: '15px',
            fontWeight: '500',
            color: '#333333',
            marginBottom: '5px',
          },
          experienceDate: {
            fontSize: '14px',
            color: '#666666',
            marginBottom: '10px',
            fontStyle: 'italic',
          },
          skillsGrid: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          },
          skillItem: {
            fontSize: '14px',
            color: '#444444',
            display: 'flex',
            justifyContent: 'space-between',
            '& > span:last-child': {
              color: '#666666',
              fontStyle: 'italic',
            },
          },
          educationItem: {
            marginBottom: '20px',
          },
          link: {
            color: '#2563eb',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          }
        };
    }
  };

  const highlightMainSection = (text) => {
    const mainSections = ['NAME', 'CONTACT', 'SUMMARY', 'EXPERIENCE', 'EDUCATION', 'SKILLS', 'TECHNICAL SKILLS', 'ACHIEVEMENTS', 'QUALIFICATIONS', 'PROJECTS', 'CERTIFICATIONS', 'LANGUAGES'];
    return mainSections.some(section => text.toUpperCase().includes(section));
  };

  const formatContent = (content, theme) => {
    const styles = getThemeStyles(theme);
    const sections = content.split('\n\n');
    let formattedContent = '';

    if (theme === THEMES.JANNA) { // Minimal theme
      sections.forEach((section, index) => {
        const lines = section.split('\n');
        if (index === 0) { // Name section
          formattedContent += `
            <div style="margin-bottom: 25px;">
              <h1 style="font-size: 24px; font-weight: 600; color: #333333; margin-bottom: 15px;">
                ${lines[0].replace(/\*\*/g, '')}
              </h1>
              <div style="display: flex; flex-wrap: wrap; gap: 8px; color: #333333; font-size: 14px;">
                ${lines.slice(1).map(contact => {
                  const cleanContact = contact.replace(/^\*/, '').trim();
                  if (cleanContact.includes('@')) {
                    return `<a href="mailto:${cleanContact}" style="color: #333333; text-decoration: none;">${cleanContact}</a>`;
                  } else if (cleanContact.includes('linkedin')) {
                    return `<a href="${cleanContact}" style="color: #333333; text-decoration: none;">${cleanContact}</a>`;
                  }
                  return `<span>${cleanContact}</span>`;
                }).join(' | ')}
              </div>
            </div>
          `;
        } else {
          const isMainSection = lines[0].toLowerCase().includes('experience') || 
                              lines[0].toLowerCase().includes('education') || 
                              lines[0].toLowerCase().includes('skills') || 
                              lines[0].toLowerCase().includes('achievements') ||
                              lines[0].startsWith('**');
          
          formattedContent += `
            <div style="margin-bottom: 25px;">
              <h2 style="
                font-size: ${isMainSection ? '18px' : '16px'}; 
                font-weight: ${isMainSection ? '700' : '600'}; 
                color: #333333; 
                text-transform: uppercase; 
                margin-bottom: 15px; 
                border-bottom: ${isMainSection ? '2px solid #2563eb' : '1px solid #eee'}; 
                padding-bottom: 8px;
                letter-spacing: ${isMainSection ? '0.05em' : 'normal'};
                background: ${isMainSection ? 'linear-gradient(to right, #f8fafc, white)' : 'none'};
                padding: ${isMainSection ? '8px 12px' : '5px 0'};
                border-radius: 4px;
              ">
                ${lines[0].replace(/\*\*/g, '')}
              </h2>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${lines.slice(1).map(line => {
                  const cleanLine = line.replace(/^\*/, '').replace(/^\-/, '').trim();
                  return `<div style="color: #444444; padding: 4px 0; position: relative; padding-left: 15px;">
                    <span style="position: absolute; left: 0; color: ${isMainSection ? '#2563eb' : '#666666'};">•</span>
                    ${cleanLine}
                  </div>`;
                }).join('')}
              </div>
            </div>
          `;
        }
      });
    } else if (theme === THEMES.JOHNNY) { // Modern theme
      sections.forEach((section, index) => {
        const lines = section.split('\n');
        if (index === 0) {
          formattedContent += `
            <div style="margin-bottom: 35px; border-bottom: 2px solid #3182ce; padding-bottom: 20px;">
              <div style="font-size: 32px; color: #2d3748; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; text-align: center; margin-bottom: 12px;">
                ${lines[0].replace(/\*\*/g, '')}
              </div>
              <div style="display: flex; justify-content: center; align-items: center; gap: 15px; font-size: 13px; color: #4a5568;">
                ${lines.slice(1).join(' | ')}
              </div>
            </div>
          `;
        } else {
          const isMainSection = lines[0].toLowerCase().includes('experience') || 
                              lines[0].toLowerCase().includes('education') || 
                              lines[0].toLowerCase().includes('skills') || 
                              lines[0].toLowerCase().includes('achievements') ||
                              lines[0].startsWith('**');
          
          formattedContent += `
            <div style="margin-top: 25px;">
              <div style="
                color: ${isMainSection ? '#2563eb' : '#3182ce'}; 
                text-transform: uppercase; 
                font-size: ${isMainSection ? '20px' : '16px'}; 
                font-weight: ${isMainSection ? '700' : '600'}; 
                letter-spacing: 0.05em; 
                margin-bottom: 15px; 
                display: flex; 
                align-items: center; 
                gap: 15px;
                background: ${isMainSection ? 'linear-gradient(to right, #f0f9ff, transparent)' : 'none'};
                padding: ${isMainSection ? '10px 15px' : '0'};
                border-radius: 4px;
                box-shadow: ${isMainSection ? '0 2px 4px rgba(37, 99, 235, 0.1)' : 'none'};
              ">
                ${lines[0].replace(/\*\*/g, '')}
                <div style="flex: 1; height: ${isMainSection ? '3px' : '2px'}; background: ${isMainSection ? 'linear-gradient(to right, #2563eb, #e2e8f0)' : '#e2e8f0'};"></div>
              </div>
              <div style="margin-top: 12px;">
                ${lines.slice(1).map(line => `
                  <div style="font-size: 13px; margin-bottom: 10px; padding-left: 20px; position: relative; line-height: 1.6; color: #4a5568;">
                    <span style="position: absolute; left: 0; color: ${isMainSection ? '#2563eb' : '#3182ce'}; font-weight: bold;">•</span>
                    ${line.trim().startsWith('-') ? line.substring(1).trim() : line}
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }
      });
    } else if (theme === THEMES.MILAN) { // Milan theme
      sections.forEach((section, index) => {
        const lines = section.split('\n');
        if (index === 0) {
          formattedContent += `
            <div style="margin-bottom: 30px; border-left: 4px solid #8B4513; padding-left: 15px;">
              <div style="font-size: 28px; font-weight: 700; color: #8B4513; margin-bottom: 12px; letter-spacing: 0.025em; text-transform: uppercase;">
                ${lines[0].replace(/\*\*/g, '')}
              </div>
              <div style="font-size: 13px; color: #666; display: flex; gap: 15px; margin-bottom: 25px; align-items: center; flex-wrap: wrap;">
                ${lines.slice(1).map(contact => 
                  `<span style="display: inline-flex; align-items: center; gap: 6px; color: #666; transition: color 0.2s;">${contact}</span>`
                ).join(' | ')}
              </div>
            </div>
          `;
        } else {
          const isMainSection = lines[0].toLowerCase().includes('experience') || 
                              lines[0].toLowerCase().includes('education') || 
                              lines[0].toLowerCase().includes('skills') || 
                              lines[0].toLowerCase().includes('achievements') ||
                              lines[0].startsWith('**');
          
          const icon = getSectionIcon(lines[0]);
          formattedContent += `
            <div style="margin-bottom: 30px; position: relative;">
              <div style="position: absolute; left: -20px; top: 0; bottom: 0; width: ${isMainSection ? '3px' : '2px'}; background: linear-gradient(to bottom, #8B4513 0%, transparent 100%); opacity: ${isMainSection ? '0.3' : '0.2'};"></div>
              <div style="
                font-size: ${isMainSection ? '20px' : '16px'}; 
                font-weight: ${isMainSection ? '800' : '700'}; 
                color: #333; 
                text-transform: uppercase; 
                display: flex; 
                align-items: center; 
                gap: 12px; 
                margin-bottom: 20px; 
                position: relative; 
                padding-left: 32px; 
                letter-spacing: 0.05em;
                background: ${isMainSection ? 'linear-gradient(to right, rgba(139, 69, 19, 0.1), transparent)' : 'none'};
                padding: ${isMainSection ? '12px 32px' : '0 32px'};
                border-radius: 4px;
                transform: ${isMainSection ? 'translateX(-8px)' : 'none'};
                box-shadow: ${isMainSection ? '0 2px 4px rgba(139, 69, 19, 0.1)' : 'none'};
              ">
                <div style="
                  position: absolute; 
                  left: 0; 
                  width: ${isMainSection ? '28px' : '24px'}; 
                  height: ${isMainSection ? '28px' : '24px'}; 
                  display: flex; 
                  align-items: center; 
                  justify-content: center; 
                  background-color: #8B4513; 
                  border-radius: 6px; 
                  color: white; 
                  font-size: ${isMainSection ? '14px' : '12px'}; 
                  box-shadow: ${isMainSection ? '0 4px 8px' : '0 2px 4px'} rgba(139, 69, 19, 0.2); 
                  transform: rotate(-5deg);
                ">
                  ${icon}
                </div>
                ${lines[0].replace(/\*\*/g, '')}
                <div style="flex: 1; height: ${isMainSection ? '2px' : '1px'}; background: linear-gradient(to right, #8B4513 0%, transparent 100%); opacity: ${isMainSection ? '0.3' : '0.2'};"></div>
              </div>
              <div style="font-size: 14px; line-height: 1.8; color: #444; position: relative; z-index: 1;">
                ${lines.slice(1).map(line => `
                  <div style="position: relative; padding-left: 20px; margin-bottom: 12px; transition: transform 0.2s;">
                    <span style="position: absolute; left: 0; color: #8B4513; font-weight: ${isMainSection ? '800' : '700'};">•</span>
                    ${line.trim().startsWith('-') ? line.substring(1).trim() : line}
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }
      });
    }

    return `
      <div style="font-family: 'Poppins', sans-serif; line-height: 1.6;">
        ${formattedContent}
      </div>
    `;
  };

  const handleDownload = async () => {
    try {
      if (!resumeRef.current) {
        throw new Error('Resume content not ready');
      }

      const zip = new JSZip();
      const dataUrl = await htmlToImage.toJpeg(resumeRef.current, {
        quality: 1.0,
        backgroundColor: 'white',
        pixelRatio: 2,
        width: 850,
        height: 1100,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        },
      });

      zip.file("resume.jpg", dataUrl.split('base64,')[1], { base64: true });
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `resume-${selectedTheme}.zip`);
    } catch (error) {
      console.error('Error generating resume image:', error);
      alert('Failed to generate resume image. Please try again.');
    }
  };

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleContentChange = (e) => {
    setEditedContent(e.target.value);
  };

  const getSectionIcon = (sectionTitle) => {
    const title = sectionTitle.toLowerCase().replace(/\*\*/g, '');
    if (title.includes('profile')) return '👤';
    if (title.includes('skills')) return '💪';
    if (title.includes('strengths')) return '⭐';
    if (title.includes('education')) return '🎓';
    if (title.includes('awards')) return '🏆';
    if (title.includes('volunteering')) return '❤️';
    if (title.includes('hobbies')) return '🎯';
    if (title.includes('projects')) return '🚀';
    if (title.includes('languages')) return '🌐';
    if (title.includes('certifications')) return '📜';
    return '📝';
  };

  const formatSkillsSection = (skills) => {
    return `
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
        ${skills.map(skill => {
          const [name, level] = skill.split(':').map(s => s.trim());
          const dots = parseInt(level) || 3;
          return `
            <div>
              <div style="font-weight: 600; margin-bottom: 5px;">${name}</div>
              <div style="display: flex; align-items: center; gap: 5px;">
                ${Array(5).fill(0).map((_, i) => `
                  <div style="
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background-color: ${i < dots ? '#FFE5B4' : '#E5E5E5'};
                    margin-right: 2px;
                  "></div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  };

  const formatRegularSection = (lines) => {
    return `
      <div style="font-size: 13px; line-height: 1.6; color: #444;">
        ${lines.map(line => {
          if (line.includes('|')) {
            const [date, location] = line.split('|').map(s => s.trim());
            return `
              <div style="color: #666; font-size: 12px; margin-bottom: 5px;">
                ${date} | ${location}
              </div>
            `;
          }
          return `
            <div style="
              position: relative;
              padding-left: 15px;
              margin-bottom: 5px;
            ">
              ${line.trim().startsWith('-') ? 
                `<span style="
                  position: absolute;
                  left: 0;
                  color: #FFE5B4;
                ">•</span>${line.substring(1)}` : 
                line}
            </div>
          `;
        }).join('')}
      </div>
    `;
  };

  if (!resumeContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            No resume content available
          </h2>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-4 sm:py-8">
      <div className="max-w-[850px] mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Resume Preview</h1>
            <div className="flex items-center gap-2 ml-auto sm:ml-4">
              <span className="text-sm text-gray-600">Theme:</span>
              <select
                value={selectedTheme}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="block w-28 sm:w-32 px-2 sm:px-3 py-1 sm:py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={THEMES.JANNA}>Minimal</option>
                <option value={THEMES.JOHNNY}>Modern</option>
                <option value={THEMES.MILAN}>Milan</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigate('/')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back
            </button>
            <button
              onClick={handleEdit}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isEditing ? 'Preview' : 'Edit'}
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Download
            </button>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {isEditing ? (
            <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                </div>
                <div className="text-sm text-gray-500">Resume Editor</div>
              </div>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-10 bg-gray-900 flex flex-col items-center pt-4 text-gray-400 text-xs select-none border-r border-gray-700">
                  {Array.from({ length: 50 }, (_, i) => (
                    <div key={i} className="h-6 w-full text-center flex items-center justify-center">{i + 1}</div>
                  ))}
                </div>
                <style>
                  {`
                    .resume-editor {
                      position: relative;
                      margin-left: 40px;
                      background: #fff;
                    }
                    .resume-editor::after {
                      content: '';
                      position: absolute;
                      top: 0;
                      right: 0;
                      bottom: 0;
                      width: 8px;
                      background: transparent;
                    }
                    .resume-editor::-webkit-scrollbar {
                      width: 8px;
                    }
                    .resume-editor::-webkit-scrollbar-track {
                      background: #1f2937;
                    }
                    .resume-editor::-webkit-scrollbar-thumb {
                      background: #4b5563;
                      border-radius: 4px;
                    }
                    .resume-editor::-webkit-scrollbar-thumb:hover {
                      background: #6b7280;
                    }
                    .highlight-section {
                      color: #2563eb;
                      font-weight: 700;
                      background: linear-gradient(90deg, rgba(37, 99, 235, 0.1) 0%, transparent 100%);
                      border-radius: 4px;
                      padding: 2px 8px;
                      margin: 0 -8px;
                    }
                  `}
                </style>
                <textarea
                  value={editedContent}
                  onChange={(e) => {
                    const content = e.target.value;
                    const lines = content.split('\n');
                    const highlightedLines = lines.map(line => {
                      if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
                        return line;
                      }
                      const mainSections = ['NAME', 'CONTACT', 'SUMMARY', 'EXPERIENCE', 'EDUCATION', 'SKILLS', 'TECHNICAL SKILLS', 'ACHIEVEMENTS', 'QUALIFICATIONS', 'PROJECTS', 'CERTIFICATIONS', 'LANGUAGES'];
                      const isMainSection = mainSections.some(section => 
                        line.trim().toUpperCase() === section ||
                        line.trim().toUpperCase().startsWith(section + ':') ||
                        line.trim().toUpperCase().startsWith('**' + section)
                      );
                      return isMainSection ? `**${line.trim()}**` : line;
                    });
                    setEditedContent(highlightedLines.join('\n'));
                  }}
                  className="resume-editor w-full h-[600px] sm:h-[800px] p-4 pl-4 text-sm border-0 rounded-md 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200
                    font-mono leading-relaxed tracking-wide
                    shadow-inner resize-none"
                  style={{
                    whiteSpace: 'pre-wrap',
                    overflowY: 'auto',
                    tabSize: 2,
                  }}
                  spellCheck="false"
                  placeholder="Enter your resume content here..."
                />
              </div>
              <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>Preview mode available</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span>Auto-saving enabled</span>
                  </div>
                </div>
                <div className="text-right">
                  Press Ctrl + S to save
                </div>
              </div>
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <div
                ref={resumeRef}
                className="resume-container"
                style={{
                  ...getThemeStyles(selectedTheme).container,
                  width: '100%',
                  maxWidth: '850px',
                  height: 'auto',
                  minHeight: '1100px',
                  margin: '0 auto',
                  boxSizing: 'border-box',
                  position: 'relative',
                  backgroundColor: 'white',
                  transform: 'scale(var(--scale, 1))',
                  transformOrigin: 'top center',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  padding: '40px 50px',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}
              >
                <style>
                  {`
                    .resume-container {
                      position: relative;
                      isolation: isolate;
                    }
                    
                    .resume-container::before {
                      content: '';
                      position: absolute;
                      inset: 0;
                      background: linear-gradient(
                        135deg,
                        rgba(255, 255, 255, 0.1),
                        rgba(255, 255, 255, 0.05)
                      );
                      border-radius: 12px;
                      z-index: -1;
                    }

                    .resume-container::after {
                      content: '';
                      position: absolute;
                      inset: -1px;
                      background: linear-gradient(
                        to right,
                        rgba(255, 255, 255, 0.1),
                        rgba(255, 255, 255, 0.05)
                      );
                      border-radius: 12px;
                      z-index: -2;
                      filter: blur(4px);
                    }

                    .section-title {
                      font-size: 1.25rem;
                      font-weight: 600;
                      color: #1a1a1a;
                      margin-bottom: 1rem;
                      padding-bottom: 0.5rem;
                      border-bottom: 2px solid #e5e7eb;
                      position: relative;
                    }

                    .section-title::after {
                      content: '';
                      position: absolute;
                      left: 0;
                      bottom: -2px;
                      width: 50px;
                      height: 2px;
                      background: #3b82f6;
                      transition: width 0.3s ease;
                    }

                    .section-title:hover::after {
                      width: 100px;
                    }

                    .content-block {
                      background: rgba(255, 255, 255, 0.8);
                      border-radius: 8px;
                      padding: 1rem;
                      margin-bottom: 1rem;
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                      transition: transform 0.2s ease, box-shadow 0.2s ease;
                    }

                    .content-block:hover {
                      transform: translateY(-2px);
                      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }

                    .bullet-point {
                      position: relative;
                      padding-left: 1.5rem;
                      margin-bottom: 0.5rem;
                      line-height: 1.6;
                    }

                    .bullet-point::before {
                      content: '';
                      position: absolute;
                      left: 0;
                      top: 0.6rem;
                      width: 6px;
                      height: 6px;
                      background: #3b82f6;
                      border-radius: 50%;
                      transition: transform 0.2s ease;
                    }

                    .bullet-point:hover::before {
                      transform: scale(1.5);
                    }

                    .contact-info {
                      display: flex;
                      gap: 1rem;
                      flex-wrap: wrap;
                      margin-bottom: 1.5rem;
                      padding: 1rem;
                      background: rgba(59, 130, 246, 0.05);
                      border-radius: 8px;
                      border: 1px solid rgba(59, 130, 246, 0.1);
                    }

                    .contact-item {
                      display: flex;
                      align-items: center;
                      gap: 0.5rem;
                      color: #4b5563;
                      font-size: 0.875rem;
                      padding: 0.25rem 0.75rem;
                      background: white;
                      border-radius: 4px;
                      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
                      transition: transform 0.2s ease;
                    }

                    .contact-item:hover {
                      transform: translateY(-1px);
                    }

                    .skills-grid {
                      display: grid;
                      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                      gap: 1rem;
                      margin-top: 1rem;
                    }

                    .skill-item {
                      background: white;
                      padding: 0.75rem;
                      border-radius: 6px;
                      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                      border: 1px solid rgba(0, 0, 0, 0.05);
                      transition: all 0.2s ease;
                    }

                    .skill-item:hover {
                      transform: translateY(-2px);
                      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                      border-color: rgba(59, 130, 246, 0.3);
                    }

                    @media (max-width: 640px) {
                      .resume-container {
                        --scale: 0.6;
                        padding: 20px 25px;
                      }
                    }

                    @media (min-width: 641px) and (max-width: 768px) {
                      .resume-container {
                        --scale: 0.7;
                        padding: 30px 35px;
                      }
                    }

                    @media (min-width: 769px) and (max-width: 1024px) {
                      .resume-container {
                        --scale: 0.85;
                      }
                    }

                    @media (min-width: 1025px) {
                      .resume-container {
                        --scale: 1;
                      }
                    }
                    
                    .resume-container * {
                      overflow-wrap: break-word;
                      word-wrap: break-word;
                      -ms-word-break: break-all;
                      word-break: break-word;
                    }
                  `}
                </style>
                <div dangerouslySetInnerHTML={{ 
                  __html: formatContent(editedContent, selectedTheme) 
                }} />
              </div>
            </div>
          )}
        </div>

        <div className="sm:hidden mt-4">
          <button
            onClick={handleDownload}
            className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Download Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview; 