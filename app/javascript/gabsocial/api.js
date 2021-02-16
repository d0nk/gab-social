'use strict';

import axios from 'axios';
import LinkHeader from 'http-link-header';
import ready from './ready';

export const getLinks = response => {
  const value = response.headers.link;

  if (!value) {
    return { refs: [] };
  }

  return LinkHeader.parse(value);
};

const csrfHeader = {};

function setCSRFHeader() {
  const csrfToken = document.querySelector('meta[name=csrf-token]');
  if (csrfToken) {
    csrfHeader['X-CSRF-Token'] = csrfToken.content;
  }
}

ready(setCSRFHeader);

export default getState => {
  const authToken = getState ? getState().getIn(['meta', 'access_token'], '') : null;

  return axios.create({
    headers: Object.assign(csrfHeader, authToken ? {
      'Authorization': `Bearer ${authToken}`,
    } : {}),

    transformResponse: [function (data) {
      try {
        return JSON.parse(data);
      } catch (Exception) {
        return data;
      }
    }],
  });
};
