import { CanDeactivateFn } from '@angular/router';
import { ArticleFormComponent } from '../../admin/articles/article-form/article-form.component';

export const unsavedChangesGuard: CanDeactivateFn<ArticleFormComponent> = (component) => {
  if (component.formDirty) {
    return confirm('Es gibt ungespeicherte Änderungen. Seite wirklich verlassen?');
  }
  return true;
};
