'use strict';

const React = require('react');

const TopNavigation = () => {
  return (
    <div className='header clearfix'>
      <nav>
        <ul className='nav nav-pills pull-right'>
          <li role='presentation' className='active'><a href='#'>Planificación</a></li>
          <li role='presentation'><a href='#'>Historial</a></li>
        </ul>
      </nav>
      <h3 className='text-muted'>Planificación de Procesos</h3>
    </div>
  );
};

module.exports = TopNavigation;
