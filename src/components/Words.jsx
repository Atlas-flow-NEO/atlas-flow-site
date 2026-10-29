// Splits a headline into words for staggered reveals (.w spans, --i = word index).
export default function Words({ text }) {
  return text.split(' ').map((w, i) => <span key={i}><span className="w" style={{ '--i': i }}>{w}</span>{' '}</span>);
}
