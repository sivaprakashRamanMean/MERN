import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getArticle, deleteArticle } from '../../store/actions/articlesActions';
import './Article.css';
import { withRouter } from 'react-router-dom';



class Article extends Component {
    componentDidMount() {
        // this.getSingleArticle();
        console.log(this.props, "props");
    }

    handleEditArticleClick() {
        this.getSingleArticle();

    }

    getSingleArticle() {
        debugger;
        if (this.props.id) {
            this.props.getArticle(this.props.id)
                console.log("Welcome")
            this.props.history.push('/article/edit/' + this.props.id);
            // });
        }
    }

    handleDeleteArticleClick() {
        alert('We are deleting your article...');
        this.props.deleteArticle(this.props.id)
        .then(res => {
            if (res.success) {
                window.location.reload(false);
            }
        })
    }

    render() {
        return (
            <li className="Article">
            <strong className="m-4">{this.props.title}</strong> | 
            <strong className="m-4">{this.props.data.author}</strong> | 
            <strong className="m-4">{this.props.data.body}</strong> |
        <strong className="m-4">{this.props.data.addedOn}</strong>
                {this.props.isAuthenticated
                    && <button
                        className="btn btn-danger"
                        style={{float: 'right', padding: '2px 12px'}}
                        onClick={() => this.handleDeleteArticleClick()}>Delete</button>}
                    {this.props.isAuthenticated
                    && 
                    <button
                        className="btn btn-info mr-2 mb-2"
                        style={{float: 'right', padding: '2px 12px'}}
                        onClick={() => this.handleEditArticleClick()}>Edit</button>}
            </li>
        );
    }
}

const mapStateToProps = state => {
    console.log(state , "Artical")
    return {
        article: state.articles.article,
        isAuthenticated: state.users.isAuthenticated,
        authenticatedUsername: state.users.authenticatedUsername
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getArticle: (articleId) => dispatch(getArticle(articleId)),
        deleteArticle: (articleId) => dispatch(deleteArticle(articleId))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Article));