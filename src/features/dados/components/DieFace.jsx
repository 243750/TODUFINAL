'use client';

export default function DieFace({ value }) {
  if (!value) return null;
  const dot = <div className="w-2.5 h-2.5 bg-current rounded-full shadow-[0_0_5px_currentColor]"></div>;
  const empty = <div></div>;

  const faces = {
    1: [empty, empty, empty, empty, dot, empty, empty, empty, empty],
    2: [empty, empty, dot, empty, empty, empty, dot, empty, empty],
    3: [empty, empty, dot, empty, dot, empty, dot, empty, empty],
    4: [dot, empty, dot, empty, empty, empty, dot, empty, dot],
    5: [dot, empty, dot, empty, dot, empty, dot, empty, dot],
    6: [dot, empty, dot, dot, empty, dot, dot, empty, dot],
  };

  return (
    <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-2 place-items-center">
      {faces[value].map((d, i) => <div key={i}>{d}</div>)}
    </div>
  );
}
