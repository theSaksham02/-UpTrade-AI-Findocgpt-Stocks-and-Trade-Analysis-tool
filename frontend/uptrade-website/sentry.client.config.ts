import * as Sentry from '@sentry/nextjs'
import { sentryOptions } from './lib/sentry-options'

if (sentryOptions.enabled && !Sentry.getClient()) Sentry.init(sentryOptions)
