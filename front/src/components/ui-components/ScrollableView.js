import './ScrollableView.css';
import { createContext, useContext, useEffect, useRef, useState, forwardRef } from 'react';

// Create a context for the scroll container ref
const ScrollContainerContext = createContext(null);

const ScrollableView = forwardRef(({ children, className = '', ...props }, externalRef) => {
    // Filter out any potential scrollContainerRef prop that might be coming from parent
    const { scrollContainerRef: _, ...domProps } = props;

    // Create an internal ref that will be shared via context
    const internalScrollContainerRef = useRef(null);

    // Sync the internal ref object with external ref if provided
    useEffect(() => {
        if (internalScrollContainerRef.current && externalRef) {
            if (typeof externalRef === 'function') {
                externalRef(internalScrollContainerRef.current);
            } else {
                externalRef.current = internalScrollContainerRef.current;
            }
        }
    }, [externalRef]);

    return (
        <ScrollContainerContext.Provider value={internalScrollContainerRef}>
            <div className={`scrollable-view ${className}`} {...domProps}>
                {children}
            </div>
        </ScrollContainerContext.Provider>
    );
});

const Header = ({ children, className = '', ...props }) => {
    const [hasScrollClass, setHasScrollClass] = useState(false);

    // Filter out any potential scrollContainerRef prop that might be coming from parent
    const { scrollContainerRef: _, ...domProps } = props;

    // Get the ref from context
    const scrollContainerRef = useContext(ScrollContainerContext);

    useEffect(() => {
        const scrollableElement = scrollContainerRef?.current;

        if (!scrollableElement) return;

        const handleScroll = () => {
            setHasScrollClass(scrollableElement.scrollTop > 0);
        };

        // Initial check
        handleScroll();

        scrollableElement.addEventListener('scroll', handleScroll);

        return () => {
            scrollableElement.removeEventListener('scroll', handleScroll);
        };
    }, [scrollContainerRef]);

    return (
        <div
            className={`scrollable-view__header ${hasScrollClass ? 'scrollable-view__header_with_shadow' : ''} ${className}`}
            {...domProps}
        >
            {children}
        </div>
    );
};

const Body = ({ children, className = '', ...props }) => {
    // Filter out any potential scrollContainerRef prop that might be coming from parent
    const { scrollContainerRef: _, ...domProps } = props;

    // Get the ref from context
    const scrollContainerRef = useContext(ScrollContainerContext);

    return (
        <div
            ref={scrollContainerRef}
            className={`scrollable-view__body ${className}`}
            {...domProps}
        >
            {children}
        </div>
    );
};

ScrollableView.Header = Header;
ScrollableView.Body = Body;

export default ScrollableView;
