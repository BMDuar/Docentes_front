import styled from "styled-components";
import { FaSearchengin } from "react-icons/fa"

export const body = styled.div`
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 20px;
    `


.container {
    max-width: 70vw;
    margin: auto;
    background: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

#btnNovoDocente{
    font-size: 20px;
    background: #532b88;
    color: white;
    padding: 20px;
    border-radius: 5px;
    border-style: none;
}

#btnNovoDocente::hover{
    color: purple;
}


#btnEditar{
    font-size: 20px;
    background: #2ca06e;
    color: white;
    padding: 20px;
    border-radius: 5px;
    border-style: none;
}

h1, h2 {
    text-align: center;
}

button {
    margin: 10px 0;
}

.hidden {
    display: none;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
}