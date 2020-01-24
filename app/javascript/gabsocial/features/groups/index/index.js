import ImmutablePropTypes from 'react-immutable-proptypes';
import { fetchGroups } from '../../../actions/groups';
import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import GroupCard from './card';
import GroupCreate from '../create';

const messages = defineMessages({
	heading: { id: 'column.groups', defaultMessage: 'Groups' },
	create: { id: 'groups.create', defaultMessage: 'Create group' },
	tab_featured: { id: 'groups.tab_featured', defaultMessage: 'Featured' },
	tab_member: { id: 'groups.tab_member', defaultMessage: 'Groups you\'re in' },
	tab_admin: { id: 'groups.tab_admin', defaultMessage: 'Groups you manage' },
});

const mapStateToProps = (state, { activeTab }) => ({
	groupIds: state.getIn(['group_lists', activeTab]),
});

export default @connect(mapStateToProps)
@injectIntl
class Groups extends ImmutablePureComponent {
	static propTypes = {
		params: PropTypes.object.isRequired,
		activeTab: PropTypes.string.isRequired,
		showCreateForm: PropTypes.bool,
		dispatch: PropTypes.func.isRequired,
		groups: ImmutablePropTypes.map,
		groupIds: ImmutablePropTypes.list,
		intl: PropTypes.object.isRequired,
	};

	componentWillMount () {
		this.props.dispatch(fetchGroups(this.props.activeTab));
	}

	componentDidUpdate(oldProps) {
		if (this.props.activeTab && this.props.activeTab !== oldProps.activeTab) {
			this.props.dispatch(fetchGroups(this.props.activeTab));
		}
	}

	renderHeader() {
		const { intl, activeTab } = this.props;

		return (
			<div className="group-column-header">
				<div className="group-column-header__cta"><Link to="/groups/create" className="button">{intl.formatMessage(messages.create)}</Link></div>
				<div className="group-column-header__title">{intl.formatMessage(messages.heading)}</div>

				<div className="column-header__wrapper">
					<h1 className="column-header">
						<Link to='/groups' className={classNames('btn grouped', {'active': 'featured' === activeTab})}>
							{intl.formatMessage(messages.tab_featured)}
						</Link>

						<Link to='/groups/browse/member' className={classNames('btn grouped', {'active': 'member' === activeTab})}>
							{intl.formatMessage(messages.tab_member)}
						</Link>

						<Link to='/groups/browse/admin' className={classNames('btn grouped', {'active': 'admin' === activeTab})}>
							{intl.formatMessage(messages.tab_admin)}
						</Link>
					</h1>
				</div>
			</div>
		);
	}

	render () {
		const { groupIds, showCreateForm } = this.props;

		return (
			<div>
				{!showCreateForm && this.renderHeader()}
				{showCreateForm && <GroupCreate /> }

				<div className="group-card-list">
					{groupIds.map(id => <GroupCard key={id} id={id} />)}
				</div>
			</div>
		);
	}
}