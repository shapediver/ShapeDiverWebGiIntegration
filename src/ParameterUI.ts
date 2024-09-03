import { ISessionApi, PARAMETER_TYPE } from "@shapediver/viewer.session";
import type { IUiConfigContainer, UiObjectConfig } from "webgi";

/**
 * Uses the parameters of the session API to create an UI.
 * 
 * This example code is only used for demonstration purposes and should be replaced with a more sophisticated UI.
 */
export class ParameterUI implements IUiConfigContainer {
  // #region Properties (2)

  public uiConfig: UiObjectConfig;

  // #endregion Properties (2)

  // #region Constructors (1)

  constructor(sessionApi?: ISessionApi) {
    this.uiConfig = {
      type: "folder",
      label: "ShapeDiver",
      expanded: true,
      children: [],
    }
    if (!sessionApi) return;

    // create a props object to store the parameter values
    let props: {
      [key: string]: any
    } = {};

    // iterate over all parameters
    for (let p in sessionApi.parameters) {

      // get the parameter and assign the properties
      const parameterObject = sessionApi.parameters[p];
      if (parameterObject.hidden === true) continue;

      // set the default value
      props[p] = parameterObject.defval;

      if (
        parameterObject.type === PARAMETER_TYPE.INT ||
        parameterObject.type === PARAMETER_TYPE.FLOAT ||
        parameterObject.type === PARAMETER_TYPE.EVEN ||
        parameterObject.type === PARAMETER_TYPE.ODD
      ) {
        // cast to number
        props[p] = +parameterObject.defval;

        // calculate stepSize
        let stepSize = 1;
        if (parameterObject.type === PARAMETER_TYPE.INT)
          stepSize = 1;
        else if (parameterObject.type === PARAMETER_TYPE.EVEN || parameterObject.type === PARAMETER_TYPE.ODD)
          stepSize = 2;
        else
          stepSize = 1 / Math.pow(10, parameterObject.decimalplaces!);

        this.uiConfig.children?.push({
          uuid: parameterObject.id,
          type: "slider",
          label: parameterObject.name,
          property: [props, p],
          bounds: [parameterObject.min!, parameterObject.max!],
          stepSize,
          onChange: (ev: any) => {
            if (!ev.last) return;
            sessionApi.parameters[parameterObject.id].value = parameterObject.decimalplaces !== undefined ? props[p].toFixed(parameterObject.decimalplaces) + '' : props[p] + '';
            sessionApi.customize();
          }
        })
      } else if (parameterObject.type === PARAMETER_TYPE.BOOL) {
        // cast to bool
        props[p] = parameterObject.defval === "true";

        this.uiConfig.children?.push({
          uuid: parameterObject.id,
          type: "checkbox",
          label: parameterObject.name,
          property: [props, p],
          onChange: () => {
            sessionApi.parameters[parameterObject.id].value = props[p] + '';
            sessionApi.customize();
          }
        })
      } else if (parameterObject.type === PARAMETER_TYPE.STRING) {
        this.uiConfig.children?.push({
          uuid: parameterObject.id,
          type: "input",
          label: parameterObject.name,
          property: [props, p],
          onChange: () => {
            sessionApi.parameters[parameterObject.id].value = props[p] + '';
            sessionApi.customize();
          }
        })
      } else if (parameterObject.type === PARAMETER_TYPE.COLOR) {
        this.uiConfig.children?.push({
          uuid: parameterObject.id,
          type: "color",
          label: parameterObject.name,
          property: [props, p],
          onChange: (ev: any) => {
            if (!ev.last) return;
            sessionApi.parameters[parameterObject.id].value = props[p].replace("#", "0x");
            sessionApi.customize();
          }
        })
      } else if (parameterObject.type === PARAMETER_TYPE.STRINGLIST) {
        // cast to number
        props[p] = +parameterObject.defval;

        const children: (UiObjectConfig<any> | (() => UiObjectConfig<any> | UiObjectConfig<any>[]))[] | undefined = [];
        for (let j = 0; j < parameterObject.choices!.length; j++) {
          children.push({
            label: parameterObject.choices![j],
            value: j,
          })
        }

        this.uiConfig.children?.push({
          uuid: parameterObject.id,
          type: "dropdown",
          label: parameterObject.name,
          property: [props, p],
          children,
          onChange: () => {
            sessionApi.parameters[parameterObject.id].value = props[p] + '';
            sessionApi.customize();
          }
        })
      }
    }
  }

  // #endregion Constructors (1)
}
