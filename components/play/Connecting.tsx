export const Connecting = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Connecting to server...</h1>
      <p className="text-lg">Please wait while we establish a connection.</p>
      <div className="flex items-center justify-center mt-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="mt-4">
        If this takes too long, please check your internet connection and then
        reload.
      </p>
    </div>
  );
};
