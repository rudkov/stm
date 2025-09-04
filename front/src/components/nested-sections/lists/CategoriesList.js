const CategoriesList = ({ categories }) => {
    return categories?.map((category) => {
        return (
            <div key={category.id}>{category.name}</div>
        );
    });
};

export default CategoriesList;
