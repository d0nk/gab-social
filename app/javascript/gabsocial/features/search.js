import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router-dom'
import { fetchSuggestions, dismissSuggestion } from '../actions/suggestions'
import HashtagItem from '../components/hashtag_item'
import Icon from '../components/icon'
import { WhoToFollowPanel } from '../components/panel'
// import TrendsPanel from '../ui/components/trends_panel'
import GroupListItem from '../components/group_list_item'
import Block from '../components/block'
import Heading from '../components/heading'
import Button from '../components/button'
import Text from '../components/text'
import Account from '../components/account'

const mapStateToProps = (state) => ({
  results: state.getIn(['search', 'results']),
  suggestions: state.getIn(['suggestions', 'items']),
});

const mapDispatchToProps = (dispatch) => ({
  fetchSuggestions: () => dispatch(fetchSuggestions()),
  dismissSuggestion: account => dispatch(dismissSuggestion(account.get('id'))),
});

export default
@withRouter
@connect(mapStateToProps, mapDispatchToProps)
class Search extends ImmutablePureComponent {

  static propTypes = {
    results: ImmutablePropTypes.map.isRequired,
    location: PropTypes.object,
  }

  state = {
    isSmallScreen: (window.innerWidth <= 895),
  }

  render () {
    const { results, location } = this.props
    const { isSmallScreen } = this.state

    if (results.isEmpty() && isSmallScreen) {
      return (
        <div />
      )
    }

    const pathname = location.pathname || ''
    const showPeople = pathname === '/search/people'
    const showHashtags = pathname === '/search/hashtags'
    const showGroups = pathname === '/search/groups'
    const isTop = !showPeople && !showHashtags && !showGroups

    let accounts, statuses, hashtags, groups

    if (results.get('accounts') && results.get('accounts').size > 0 && (isTop || showPeople)) {
      const size = isTop ? Math.min(results.get('accounts').size, 5) : results.get('accounts').size;
      accounts = (
        <Block>
          <div className={[_s.default, _s.py15].join(' ')}>
            <div className={[_s.default, _s.flexRow, _s.mb15, _s.px15].join(' ')}>
              <Heading size='h2'>
                People
              </Heading>
              <div className={[_s.default, _s.mlAuto].join(' ')}>
                <Button
                  isText
                  backgroundColor='none'
                  color='brand'
                  to='/search/people'
                >
                  <Text size='small' color='inherit' weight='bold'>
                    See All
                  </Text>
                </Button>
              </div>
            </div>

            {
              results.get('accounts').slice(0, size).map(accountId => <Account compact key={accountId} id={accountId} />)
            }
          </div>
        </Block>
      )
    }

    if (results.get('groups') && results.get('groups').size > 0 && (isTop || showGroups)) {
      const size = isTop ? Math.min(results.get('groups').size, 5) : results.get('groups').size;
      groups = (
        <div className='search-results__section'>
          <h5><Icon id='users' fixedWidth /><FormattedMessage id='search_results.groups' defaultMessage='Groups' /></h5>
          {results.get('groups').slice(0, size).map(group => <GroupListItem key={`search-${group.get('name')}`} group={group} />)}
        </div>
      );
    }

    if (results.get('hashtags') && results.get('hashtags').size > 0 && (isTop || showHashtags)) {
      const size = isTop ? Math.min(results.get('hashtags').size, 5) : results.get('hashtags').size;
      hashtags = (
        <div className='search-results__section'>
          <h5><Icon id='hashtag' fixedWidth /><FormattedMessage id='search_results.hashtags' defaultMessage='Hashtags' /></h5>
          {results.get('hashtags').slice(0, size).map(hashtag => <HashtagItem isCompact key={hashtag.get('name')} hashtag={hashtag} />)}
        </div>
      );
    }

    return (
      <div>
        {accounts}
        {groups}
        {statuses}
        {hashtags}
      </div>
    )
  }

}
