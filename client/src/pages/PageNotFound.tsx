export default function PageNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[90vh] text-gray-800">
      <h1 className="text-5xl font-bold">Uh-Oh...</h1>
      <p className="text-xl mt-10">
        The page you are looking for may have been moved, deleted, or possibly
        never existed.
      </p>
      <p className="text-9xl font-semibold tracking-widest text-orange-800 mt-16">404</p>
      <button></button>
    </div>
  );
}
