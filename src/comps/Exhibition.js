import '../config/api'
import React from 'react';
import axios from 'axios';



export class Exhibition extends React.Component{

    constructor(props) {
        super(props);
        this.state={posts:{}}
    }

    componentDidMount() {
        axios.get(this.props.source).then(res=>{
            console.log(res)
            this.setState({posts: {...res.data}});
        });
    }

    render() {
        return (
            <div>
            </div>
        );
    }
}
