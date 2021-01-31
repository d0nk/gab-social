# Be sure to restart your server when you modify this file.

# Add new inflection rules using the following format. Inflections
# are locale specific, and you may define rules for as many different
# locales as you wish. All of these examples are active by default:
# ActiveSupport::Inflector.inflections(:en) do |inflect|
#   inflect.plural /^(ox)$/i, '\1en'
#   inflect.singular /^(ox)en/i, '\1'
#   inflect.irregular 'person', 'people'
#   inflect.uncountable %w( fish sheep )
# end



# When converting a file path to a constant name and vice versa, Rails uses inflections to know
# what to do. It uses the `humanize` method to convert a path to a constant, and it uses
# `underscore` to convert a constant to a path.
#
# The inflections below are ones that do not follow the typical convention of underscore/humanize.
# Referring to it as an "acronym" is the easiest way to tell it, "this constant should just be
# downcased to become a path".
#
# BEFORE:
# 'StatsD'.underscore
# => "stats_d"
# 'statsd'.humanize
# => "Statsd"
#
# AFTER: (inflect.acronym 'StatsD')
# 'StatsD'.underscore
# => "statsd"
# 'statsd'.humanize
# => "StatsD"
ActiveSupport::Inflector.inflections(:en) do |inflect|
  inflect.acronym 'StatsD'
  inflect.acronym 'OEmbed'
  inflect.acronym 'OStatus'
  inflect.acronym 'ActivityPub'
  inflect.acronym 'PubSubHubbub'
  inflect.acronym 'ActivityStreams'
  inflect.acronym 'JsonLd'
  inflect.acronym 'REST'
end
