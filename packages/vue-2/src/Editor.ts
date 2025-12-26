import { Editor as CoreEditor } from '@digitaltrendz/core'
import type Vue from 'vue'

export class Editor extends CoreEditor {
  public contentComponent: Vue | null = null
}
