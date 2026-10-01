import { useEffect, useState } from 'react';

export default function GoogleTranslate() {
  const [currentLang, setCurrentLang] = useState('en');
  const [isChanging, setIsChanging] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' }
  ];

  useEffect(() => {
    // Check if we have a translation cookie set
    const checkCurrentLanguage = () => {
      const googtrans = getCookie('googtrans');
      if (googtrans) {
        const langMatch = googtrans.match(/\/en\/(.+)/);
        if (langMatch) {
          setCurrentLang(langMatch[1]);
        }
      }
    };

    checkCurrentLanguage();

    // Add Google Translate script
    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,de,it,fr,nl,es',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
          }, 'google_translate_element');
        }
      };

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup
      if (window.googleTranslateElementInit) {
        delete window.googleTranslateElementInit;
      }
    };
  }, []);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const setCookie = (name, value, days = 30) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const isSecure = protocol === 'https:';
    
    // Build cookie string with proper attributes
    let cookieString = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
    
    // Add domain - try without www prefix for broader compatibility
    const domain = hostname.replace('www.', '');
    cookieString += `; domain=.${domain}`;
    
    // Add security attributes for HTTPS
    if (isSecure) {
      cookieString += `; Secure`;
    }
    
    cookieString += `; SameSite=Lax`;
    
    console.log(`Setting cookie: ${cookieString}`);
    document.cookie = cookieString;
    
    // Verify the cookie was set
    setTimeout(() => {
      const verification = getCookie(name);
      console.log(`Cookie verification - ${name}:`, verification);
    }, 50);
  };

  // AGGRESSIVE COOKIE CLEARING - More reliable approach
  const clearAllGoogleTranslateCookies = () => {
    console.log('🧹 Starting aggressive cookie clearing...');
    
    // Get current domain info
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const isSecure = protocol === 'https:';
    
    // Get all current cookies to see what we're working with
    const allCookies = document.cookie.split(';');
    console.log('Current cookies before clearing:', allCookies);
    
    // More comprehensive list of Google Translate cookie patterns
    const cookiePatterns = [
      'googtrans',
      'googtrans(0)', 
      'googtrans(1)', 
      'googtrans(2)',
      'googtrans%280%29',
      'googtrans%281%29',
      'googtrans%282%29'
    ];
    
    // Multiple domain variations to try
    const domainVariations = [
      '', // No domain specified
      `domain=${hostname}`,
      `domain=.${hostname}`,
      `domain=${hostname.replace('www.', '')}`,
      `domain=.${hostname.replace('www.', '')}`
    ];
    
    // Clear each cookie pattern with each domain variation
    cookiePatterns.forEach(cookieName => {
      domainVariations.forEach(domainSpec => {
        // Base cookie deletion
        let deleteString = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
        
        // Add domain if specified
        if (domainSpec) {
          deleteString += `; ${domainSpec}`;
        }
        
        // Add secure flag for HTTPS
        if (isSecure) {
          deleteString += `; Secure`;
        }
        
        // Add SameSite
        deleteString += `; SameSite=Lax`;
        
        // Apply the deletion
        document.cookie = deleteString;
        console.log(`Clearing: ${deleteString}`);
      });
    });
    
    // Also clear from browser storage
    try {
      localStorage.removeItem('googtrans');
      sessionStorage.removeItem('googtrans');
      
      // Clear any storage items that might contain google translate data
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.toLowerCase().includes('googtrans')) {
          localStorage.removeItem(key);
        }
      }
    } catch (e) {
      console.log('Storage clearing error:', e);
    }
    
    // Verify clearing worked
    setTimeout(() => {
      const remainingCookies = document.cookie.split(';').filter(cookie => 
        cookie.toLowerCase().includes('googtrans')
      );
      console.log('Remaining Google Translate cookies:', remainingCookies);
    }, 100);
  };

  const changeLanguage = (langCode) => {
    if (isChanging) return;
    
    console.log(`🔄 Changing language to: ${langCode}`);
    console.log('Current cookies before change:', document.cookie);
    
    setIsChanging(true);
    
    // STEP 1: Aggressively clear ALL Google Translate cookies
    clearAllGoogleTranslateCookies();
    
    // STEP 2: Wait longer for cookies to be fully cleared
    setTimeout(() => {
      console.log('Cookies after clearing:', document.cookie);
      
      if (langCode === 'en') {
        // For English, just reload after clearing cookies
        console.log('🇺🇸 Switching to English (original) - reloading...');
        // Use replace to avoid back button issues
        window.location.replace(window.location.href);
      } else {
        // STEP 3: Set new language cookie after clearing
        console.log(`🌍 Setting new language: ${langCode}`);
        setCookie('googtrans', `/en/${langCode}`);
        
        // STEP 4: Wait a bit more then reload
        setTimeout(() => {
          console.log('Final cookies before reload:', document.cookie);
          // Use replace to avoid back button issues
          window.location.replace(window.location.href);
        }, 200);
      }
    }, 300); // Increased wait time for cookie clearing
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentLang) || languages[0];
  };

  return (
    <div className="google-translate-container">
      {/* Hidden Google Translate widget */}
      <div 
        id="google_translate_element" 
        style={{ 
          position: 'absolute',
          top: '-200px',
          left: '-200px',
          visibility: 'hidden',
          height: '1px',
          overflow: 'hidden'
        }}
      ></div>
      
      {/* Custom language selector */}
      <div className="language-selector">
        <button 
          className="language-toggle" 
          aria-label="Select language"
          title={`Current: ${getCurrentLanguage().name}`}
          disabled={isChanging}
        >
          {isChanging ? '⏳' : '🌐'}
        </button>
        <div className="language-dropdown">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`language-option ${currentLang === lang.code ? 'active' : ''}`}
              title={`Switch to ${lang.name}`}
              disabled={isChanging}
            >
              <span className="flag">{lang.flag}</span>
              <span className="lang-name">{lang.name}</span>
              {currentLang === lang.code && <span className="checkmark">✓</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}