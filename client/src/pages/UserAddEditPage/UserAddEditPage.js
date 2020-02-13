import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Card, { CardBody } from '../../components/Card';
import Loading from '../../components/Loading';
import FormUser from '../../components/forms/FormUser';

import { userActions } from '../../redux/user';

class UserAddEditPage extends Component {
  state = {
    dataLoaded: false,
  };

  componentDidMount() {
    const { match, userActions, userState } = this.props;
    const { _id } = userState.doc;
    const { id } = match.params;

    if (typeof id === 'undefined') {
      userActions.userClear();
      this.setState({ dataLoaded: true });
    } else if (id !== _id) {
      userActions.findOne(id);
    }
  }

  componentDidUpdate() {
    const { match, userState } = this.props;
    const { _id } = userState.doc;
    const { id } = match.params;

    if (id === _id && !this.state.dataLoaded) {
      this.setState({ dataLoaded: true });
    }
  }

  addUserCallback = values => {
    console.log(values);
    //userActions.add(values, () => {
    //handleGoBack();
    //});
  };

  editUserCallback = values => {
    console.log(values);
    //userActions.add(values, () => {
    //handleGoBack();
    //});
  };

  handleGoBack = () => {
    const { history, location } = this.props;

    if (location.state != null && location.state.prevPath != null) {
      history.push(location.state.prevPath);
    } else {
      history.push('/user/search');
    }
  };

  render() {
    const { dataLoaded } = this.state;
    const { userState, match } = this.props;
    const { id } = match.params;

    return (
      <>
        {dataLoaded ? (
          <div>
            <Card>
              <CardBody>
                <h1>{typeof id === 'undefined' ? 'Add User' : 'Edit User'}</h1>
              </CardBody>
            </Card>
            {typeof id === 'undefined' ? (
              <FormUser
                goBackCallback={this.handleGoBack}
                submitCallback={this.addUserCallback}
              />
            ) : (
              <FormUser
                goBackCallback={this.handleGoBack}
                submitCallback={this.editUserCallback}
                initialValues={userState.doc}
              />
            )}
          </div>
        ) : (
          <Loading />
        )}
      </>
    );
  }
}

function mapStateToProps({ user }, ownProps) {
  return {
    userState: user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators({ ...userActions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserAddEditPage);
