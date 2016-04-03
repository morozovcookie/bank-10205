import $ from 'jquery';

/**
 * @param {string} url - path for get request
 * @param {func} succ - success handler. function(response)
 * @returns {undefined}
 */
export function get(url, succ) {
    return $.ajax({
        type: 'get',
        url: url,
        headers: {
            Authorization: 'Token ' + window.localStorage.getItem('token')
        },
        dataType: 'json',
		success: succ
    });
}
