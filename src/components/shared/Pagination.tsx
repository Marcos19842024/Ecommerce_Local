interface Props{
    totalItems: number;
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>
}

export const Pagination = ({ totalItems, page, setPage }: Props) => {
    const handleNextPage = () => {
        setPage(page + 1);
    }

    const handlePrevPage = () => {
        setPage(prevPage => Math.max(prevPage - 1, 1));
    }

    const itemsPrevPage = 10;

    const totalPages = totalItems ? Math.ceil(totalItems / itemsPrevPage) : 1;

    const isLastPage = page >= totalPages;

    const startItem = (page -1) * itemsPrevPage + 1;

    const endItem = Math.min(page * itemsPrevPage, totalItems)

    return <div className="flex justify-between items-center">
        <p className="text-xs font-medium"> Mostrando
            <span className="font-bold"> {startItem} - {endItem} </span> de
            <span className="font-bold"> {totalItems} </span> productos
        </p>

        <div className="flex gap-3">
            <button
                className="btn-paginated"
                onClick={handlePrevPage}
                disabled={page === 1}> Anterior
            </button>

            <button
                className="btn-paginated"
                onClick={handleNextPage}
                disabled={isLastPage}> Siguiente
            </button>
        </div>
    </div>
};