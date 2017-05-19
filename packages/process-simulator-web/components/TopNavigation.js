'use strict';

const React = require('react');

const TopNavigation = () => {
  return (
    <nav className='navbar navbar-default nav-bar__top'>
      <div className='container-fluid'>
        <div className='navbar-header'>
          <a className='navbar-brand' href='#'>Planificador de Procesos</a>
        </div>
        <div id='navbar' className='navbar-collapse collapse'>
          <ul className='nav navbar-nav'>
            <li className='active'><a href='#'>Planificación</a></li>
            <li><a href='#'>Historial</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

module.exports = TopNavigation;
