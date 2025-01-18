import styled from 'styled-components';

interface HexagonProps {
    isWall: boolean;
    hasMouse: boolean;
}

export const Hexagon = styled.div<HexagonProps>`
    width: 50px;
    height: 57.735px;
    background: ${props => 
        props.isWall ? '#333' : 
        props.hasMouse ? '#f00' : '#fff'};
    position: relative;
    margin: 2px;
    cursor: pointer;
    border: 1px solid #333;
    clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);

    &:hover {
        background: ${props => props.isWall ? '#333' : '#eee'};
    }
`; 