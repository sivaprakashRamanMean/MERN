import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { getAllArticles, getMyArticles } from '../../store/actions/articlesActions';
import Article from '../../components/Article/Article';
import WrappedLink from '../../components/WrappedLink/WrappedLink';
import './Home.css';

class Home extends Component {
    state = {
        showMyArticles: false
    }

    componentWillMount() {
        if (this.props.location.pathname === '/article/myarticles' && !this.state.showMyArticles) {
            this.toggleShowMyArticles();
        }
    }

    componentDidMount() {
        this.props.initArticles();
        if (this.props.isAuthenticated) {
            this.props.getMyArticles();
        }
    }

    toggleShowMyArticles = () => {
        this.setState((prevState) => {
            return {
                showMyArticles: !prevState.showMyArticles
            }
        });
    }

    render() {
        let allArticles = this.props.allArticles || JSON.parse(localStorage.getItem('AllArticles'));
        allArticles = allArticles.map(article => (
            <Article
                key={article._id}
                id={article._id}
                title={article.title}
                data={article} />
        ));

        let myArticles = [];
        if (this.props.isAuthenticated && this.state.showMyArticles) {
            if (this.props.myArticles) {
                myArticles = [...this.props.myArticles];
            } else {
                myArticles = [...JSON.parse(localStorage.getItem('MyArticles'))]
            }
            myArticles = myArticles.map(article => (
                <Article
                    key={article._id}
                    id={article._id}
                    title={article.title} 
                    data={article}/>
            ));
        }

        if (!this.props.isAuthenticated) {
            return <Redirect to="/login" />;
        }

        return (
            <div className="container">
                <br />
                <div className="Header">
                    <h1 style={{display: 'inline-block'}}>List</h1>
                    <WrappedLink to="/article/add" buttonClasses={['btn', 'btn-primary', 'mr-3', 'AddArticleButton']}>Add Status</WrappedLink>
                    <WrappedLink to="/report" buttonClasses={['btn', 'btn-primary', 'mr-3', 'AddArticleButton']}>Report</WrappedLink>
                </div>
                <br />
                <div>
                    <section className="jumbotron">
                        <div className="Articles">
                            { allArticles }
                        </div>
                    </section>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        allArticles: state.articles.articles,
        myArticles: state.articles.myArticles,
        isAuthenticated: state.users.isAuthenticated
    };
};

const mapDispatchToProps = dispatch => {
    return {
        initArticles: () => dispatch(getAllArticles()),
        getMyArticles: () => dispatch(getMyArticles())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
