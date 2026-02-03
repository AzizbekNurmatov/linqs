import BoardFilters from '../components/BoardFilters';

function Board() {
  return (
    <div className="bg-[#F6F7F8] pt-32 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <BoardFilters />
        </div>
      </div>
    </div>
  );
}

export default Board;
