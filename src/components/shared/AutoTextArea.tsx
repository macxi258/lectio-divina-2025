import { useRef, useEffect } from 'react';

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export default function AutoTextArea({ label, className = '', ...props }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [props.value]);

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm font-medium text-warm-600">{label}</label>}
      <textarea
        ref={ref}
        rows={4}
        className={`w-full resize-none bg-white border border-warm-200 rounded-xl px-4 py-3 text-navy placeholder-warm-300 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors font-serif text-base leading-relaxed ${className}`}
        {...props}
      />
    </div>
  );
}
