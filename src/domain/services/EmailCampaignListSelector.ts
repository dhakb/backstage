export class EmailCampaignListSelector {
  static getListIds(formType: string | undefined, productsData: any[], isRegister: boolean): number[] {
    let listIds = [16];

    if (formType) {
      const normalized = formType.replace(/_/g, "-");
      const productId = normalized.replace(/-buy|-trial|-alt/, "");
      const product = productsData.find(el => el.id === productId);

      if (!product) return listIds;

      if (normalized.includes("-buy"))
        listIds = [product.buyEmailListId, 100];
      else if (normalized.includes("-alt"))
        listIds = [product.freeEmailListIdAlt];
      else if (normalized.includes("-trial"))
        listIds = [product.trialEmailListId];
      else
        listIds = [product.freeEmailListId];
    }

    if (!listIds.includes(16) && isRegister) listIds.push(16);

    return listIds;
  }
}
