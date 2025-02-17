function Tab(props) {

    const handleClick = (e) => {
        props.onTabClick(props._id);
    };

    if (props._id === props.selectedCategoryId) {

return(
    <button 
        className="border bg-[#edeef1] px-2 py-1 rounded-md"
        > 
        {props.name} 
     </button>
    );
}

return( 
    <button 
        className="border border-[#edeef1] px-2 py-1 rounded-md" onClick={handleClick}
    > 
        {props.name} 
     </button>

    );
}

export default Tab;