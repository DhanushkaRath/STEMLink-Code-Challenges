import { useNavigate } from "react-router-dom";

function Button(props){
    const navigate = useNavigate();

    const handleClick = (e) => {
        if (props.to) {
            navigate(props.to);
        }
        if (props.onClick) {
            props.onClick(e);
        }
    };

    return( 
    <button 
    type="button"
    onClick={handleClick}
    className="text-white bg-black rounded-md w-fit block font-medium py-2 px-4"
    >
        {props.children}
    </button>
    );
}

export default Button;