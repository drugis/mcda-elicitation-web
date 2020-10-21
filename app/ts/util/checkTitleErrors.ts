import _ from 'lodash';

interface GenericItem {
  id: string;
  title: string;
}

export function checkTitleErrors<T extends GenericItem>(
  newTitle: string,
  items: Record<string, T>,
  currentItemId?: string
): string {
  if (!newTitle) {
    return 'Empty title';
  } else if (isDuplicate(newTitle, items, currentItemId)) {
    return 'Duplicate title';
  } else {
    return '';
  }
}

function isDuplicate<T extends GenericItem>(
  title: string,
  items: Record<string, T>,
  currentItemId: string
): boolean {
  return _.some(items, (item) => {
    return item.title === title && item.id !== currentItemId;
  });
}
