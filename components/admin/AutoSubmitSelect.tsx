'use client';

import type { ComponentProps } from 'react';
import { Select } from './ui';

/**
 * A <select> inside a GET filter form that submits the form as soon as it changes,
 * so filters apply instantly. (Without JavaScript, the form's Filter button still works.)
 */
export default function AutoSubmitSelect(props: ComponentProps<typeof Select>) {
  return <Select {...props} onChange={(e) => e.currentTarget.form?.requestSubmit()} />;
}
