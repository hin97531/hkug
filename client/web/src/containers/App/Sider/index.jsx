import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Layout, Menu } from 'antd';
import { compose, withProps, withHandlers, pure } from 'recompose';
import injectSheet from 'react-jss';
import { withRouter, matchPath } from 'react-router-dom';
import { utils, modules } from 'hkug-client-core';
import { SIDE_MENU_BREAK_POINT } from '../../../constants';

const allCategories = utils.categories.default;
const { fetchTopics } = modules.topic;
const { Sider } = Layout;

const styles = theme => ({
  sider: {
    zIndex: 100,
    minHeight: '100vh',
    maxHeight: '100vh',
    overflowY: 'auto',
    overflowX: 'hidden',
    '-webkit-overflow-scrolling': 'touch',
  },
  logo: {
    height: 32,
    background: theme.primaryColor,
    margin: theme.margin,
  },
});

const AppSider = ({
  classes,
  categories,
  handleMenuItemClick,
  defaultSelectedKeys,
  menuCollapsed,
  setMenuCollapse,
}) => (
  <Sider
    className={classes.sider}
    breakpoint="md"
    collapsedWidth="0"
    trigger={null}
    collapsed={menuCollapsed}
    onCollapse={(collapsed) => { setMenuCollapse(collapsed); }}
  >
    <div className={classes.logo} />
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={defaultSelectedKeys}
      onClick={handleMenuItemClick}
    >
      {
        categories.map(c => (
          <Menu.Item key={c.id}>
            <span>{c.name}</span>
          </Menu.Item>
        ))
      }
    </Menu>
  </Sider>
);

AppSider.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  categories: PropTypes.arrayOf(PropTypes.shape({
    hkgKey: PropTypes.string,
    lihkgKey: PropTypes.number,
    name: PropTypes.string,
  })).isRequired,
  defaultSelectedKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleMenuItemClick: PropTypes.func.isRequired,
  menuCollapsed: PropTypes.bool.isRequired,
  setMenuCollapse: PropTypes.func.isRequired,
};

const enhance = compose(
  injectSheet(styles),
  withRouter,
  connect(() => ({}), { fetchTopics }),
  withProps(({ location }) => {
    const match = matchPath(location.pathname, { path: '/topics/:category' });
    const defaultSelectedKeys = [];
    if (match && match.params.category) {
      defaultSelectedKeys.push(match.params.category);
    }
    return ({ defaultSelectedKeys, categories: allCategories });
  }),
  withHandlers({
    handleMenuItemClick: props => ({ key }) => {
      if (window.innerWidth <= SIDE_MENU_BREAK_POINT) {
        props.setMenuCollapse(true);
      }
      props.fetchTopics({ category: key }, { reset: true });
      props.history.push(`/topics/${key}`);
    },
  }),
  pure,
);

export default enhance(AppSider);
