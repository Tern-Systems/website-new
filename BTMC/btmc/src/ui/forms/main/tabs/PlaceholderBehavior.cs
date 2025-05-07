using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace btmc.src.ui.forms.main.tabs
{
    public static class PlaceholderBehavior
    {
        public static readonly DependencyProperty PlaceholderProperty =
            DependencyProperty.RegisterAttached(
                "Placeholder",
                typeof(string),
                typeof(PlaceholderBehavior),
                new PropertyMetadata(string.Empty, OnPlaceholderChanged));

        public static string GetPlaceholder(TextBox textBox)
        {
            return (string)textBox.GetValue(PlaceholderProperty);
        }

        public static void SetPlaceholder(TextBox textBox, string value)
        {
            textBox.SetValue(PlaceholderProperty, value);
        }

        private static void OnPlaceholderChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            if (d is TextBox tb)
            {
                tb.GotFocus += (s, args) =>
                {
                    if (tb.Text == (string)e.NewValue)
                    {
                        tb.Text = "";
                        tb.Foreground = Brushes.White;
                    }
                };

                tb.LostFocus += (s, args) =>
                {
                    if (string.IsNullOrWhiteSpace(tb.Text))
                    {
                        tb.Text = (string)e.NewValue;
                        tb.Foreground = Brushes.Gray;
                    }
                };

                tb.Text = (string)e.NewValue;
                tb.Foreground = Brushes.Gray;
            }
        }
    }
}
