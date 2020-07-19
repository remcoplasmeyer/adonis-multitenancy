import {Organisation} from '../models/Organisation'

export default {
  /*
     * This class is responsible for determining which tenant should be the
     * current tenant for the given request.
     *
     * This class should extend `Spatie\Multitenancy\TenantFinder\TenantFinder`
     *
     */
  'tenant_finder': null,

  'switch_tenant_tasks': [
    // add tasks here
  ],

  'tenant_model': Organisation,
  'tenant_foreign_key': 'tenant_id',
}
