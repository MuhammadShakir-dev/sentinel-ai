-- 1. SECURITY DEFINER / trigger functions must not be API-callable
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO service_role;

-- 2. Remove anon exposure of user data tables (all policies are auth.uid() scoped)
REVOKE ALL ON TABLE public.profiles FROM anon;
REVOKE ALL ON TABLE public.scans FROM anon;

-- 3. Ensure signed-in access still works via REST
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;
GRANT SELECT, INSERT, DELETE ON TABLE public.scans TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;
GRANT ALL ON TABLE public.scans TO service_role;

-- 4. Remove GraphQL schema discoverability for anon/authenticated (app uses REST only)
REVOKE USAGE ON SCHEMA graphql_public FROM anon, authenticated;
REVOKE ALL ON FUNCTION graphql_public.graphql(text, text, jsonb, jsonb) FROM anon, authenticated;
REVOKE USAGE ON SCHEMA graphql FROM anon, authenticated;

-- 5. Scope policies to authenticated role explicitly
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own scans" ON public.scans;
DROP POLICY IF EXISTS "Users can insert own scans" ON public.scans;
DROP POLICY IF EXISTS "Users can view own scans" ON public.scans;

CREATE POLICY "Users can delete own scans" ON public.scans
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scans" ON public.scans
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own scans" ON public.scans
  FOR SELECT TO authenticated USING (auth.uid() = user_id);