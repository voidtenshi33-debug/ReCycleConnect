
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useLanguage } from '@/context/language-context';

interface TProps {
  children: string;
}

/**
 * A component for rendering translatable text.
 * It uses the useLanguage hook to get the current locale and translate function.
 */
export const T = ({ children }: TProps) => {
  const { locale, translate } = useLanguage();
  const [translatedText, setTranslatedText] = useState(children);

  // Generate a stable key based on the default text content.
  // This is used for caching translations.
  const translationKey = useMemo(() => {
    return children.toLowerCase().replace(/\s+/g, '_').replace(/[^\w]/g, '');
  }, [children]);

  useEffect(() => {
    let isMounted = true;
    
    // When the locale or the source text changes, re-translate.
    if (locale !== 'en') {
      translate(translationKey, children).then(text => {
        if (isMounted) {
          setTranslatedText(text);
        }
      });
    } else {
      // If the locale is English, just use the original children.
      setTranslatedText(children);
    }
    
    return () => {
        isMounted = false;
    }
  }, [locale, children, translate, translationKey]);

  return <>{translatedText}</>;
};
